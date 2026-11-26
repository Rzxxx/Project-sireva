<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
        public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        try {
            $booking = DB::transaction(function () use ($validated) {
                
                $existingBookings = DB::table('bookings')
                    ->where('facility_id', $validated['facility_id'])
                    ->whereIn('status', ['pending', 'approved'])
                    ->lockForUpdate()
                    ->get();

                // Cek Overlap (Bentrok)
                foreach ($existingBookings as $existing) {
                    $newStart = Carbon::parse($validated['start_time']);
                    $newEnd = Carbon::parse($validated['end_time']);
                    $oldStart = Carbon::parse($existing->start_time);
                    $oldEnd = Carbon::parse($existing->end_time);

                    // Rumus overlap: (Start A < End B) && (End A > Start B)
                    if ($newStart < $oldEnd && $newEnd > $oldStart) {
                        throw new \Exception('Slot waktu sudah terisi.');
                    }
                }

                return Booking::create([
                    'user_id' => Auth::id(),
                    'facility_id' => $validated['facility_id'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'status' => 'pending',
                ]);
            });

            return response()->json(['message' => 'Booking berhasil', 'data' => $booking], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}