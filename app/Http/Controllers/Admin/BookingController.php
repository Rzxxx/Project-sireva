<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Daftar pengajuan, bisa difilter berdasarkan status
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        if (! in_array($status, ['pending', 'approved', 'rejected', 'cancelled', 'all'], true)) {
            $status = 'pending';
        }

        $bookings = Booking::with(['room', 'user'])
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->orderByDesc('date')
            ->orderByDesc('start_time')
            ->get();

        $counts = Booking::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return view('admin.bookings.index', compact('bookings', 'status', 'counts'));
    }

    public function approve(Booking $booking)
    {
        return $this->setStatus($booking, 'approved', 'disetujui');
    }

    public function reject(Booking $booking)
    {
        return $this->setStatus($booking, 'rejected', 'ditolak');
    }

    private function setStatus(Booking $booking, string $status, string $label)
    {
        abort_unless($booking->status === 'pending', 403);

        $booking->update(['status' => $status]);

        return back()->with('success', 'Peminjaman ' . $label . '.');
    }
}