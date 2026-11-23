<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Booking;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();
        
        $totalFacilities = Facility::where('is_active', true)->count();

        $bookingQuery = Booking::query();

        if ($user->hasRole('Mahasiswa') || $user->hasRole('Dosen')) {
            $bookingQuery->where('user_id', $user->id);
        }

        $activeBookings = (clone $bookingQuery)->where('status', 'approved')->count();
        $pendingBookings = (clone $bookingQuery)->where('status', 'pending')->count();

        return response()->json([
            'total_facilities' => $totalFacilities,
            'active_bookings' => $activeBookings,
            'pending_bookings' => $pendingBookings,
        ]);
    }
}