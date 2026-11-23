<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'participants' => 'required|integer|min:1',
            'purpose' => 'required|string',
        ]);

        try {
            $booking = DB::transaction(function () use ($validated) {
                
                $isOverlap = Booking::where('facility_id', $validated['facility_id'])
                    ->whereIn('status', ['pending', 'approved'])
                    ->where(function ($query) use ($validated) {
                        $query->where('start_time', '<', $validated['end_time'])
                              ->where('end_time', '>', $validated['start_time']);
                    })
                    ->lockForUpdate()
                    ->exists();

                if ($isOverlap) {
                    throw new \Exception('Slot waktu sudah terisi. Silakan pilih jam lain.');
                }

                return Booking::create([
                    'user_id' => Auth::id(),
                    'facility_id' => $validated['facility_id'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'participants' => $validated['participants'],
                    'purpose' => $validated['purpose'],
                    'status' => 'pending',
                ]);

                $booking->logs()->create([
                    'user_id' => Auth::id(),
                    'action' => 'created',
                    'old_status' => null,
                    'new_status' => 'pending',
                    'notes' => 'Pengajuan peminjaman dibuat',
                ]);

                return $booking;
            });

            return response()->json(['message' => 'Pengajuan peminjaman berhasil', 'data' => $booking], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function myBookings()
    {
        $bookings = Booking::with('facility')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($bookings);
    }

    public function pendingBookings()
    {
        $bookings = Booking::with(['user', 'facility'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($bookings);
    }

    public function processBooking(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'rejection_reason' => 'required_if:action,reject|string|nullable'
        ]);

        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Hanya pengajuan berstatus pending yang bisa diproses'], 422);
        }

        $oldStatus = $booking->status;

        if ($request->action === 'approve') {
            $booking->update(['status' => 'approved']);
            $booking->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'approved',
                'old_status' => $oldStatus,
                'new_status' => 'approved',
                'notes' => 'Peminjaman disetujui',
            ]);
            return response()->json(['message' => 'Peminjaman berhasil disetujui']);
        } else {
            $booking->update([
                'status' => 'rejected',
                'rejection_reason' => $request->rejection_reason
            ]);
            $booking->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'rejected',
                'old_status' => $oldStatus,
                'new_status' => 'rejected',
                'notes' => $request->rejection_reason,
            ]);
            return response()->json(['message' => 'Peminjaman telah ditolak']);
        }
    }

    public function cancel(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string']);
        
        $booking = Booking::findOrFail($id);

        if (!in_array($booking->status, ['pending', 'approved'])) {
            return response()->json(['message' => 'Peminjaman ini tidak dapat dibatalkan lagi.'], 422);
        }

        // Pastikan hanya pemilik yang bisa cancel (atau Admin)
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if ($booking->user_id !== Auth::id() && !$user?->hasRole('Admin')) {
            return response()->json(['message' => 'Anda tidak berhak membatalkan peminjaman ini.'], 403);
        }

       try {
            DB::transaction(function () use ($booking, $request) {
                $oldStatus = $booking->status;
                
                $booking->update(['status' => 'cancelled']);
                
                $booking->logs()->create([
                    'user_id' => Auth::id(),
                    'action' => 'cancelled',
                    'old_status' => $oldStatus,
                    'new_status' => 'cancelled',
                    'notes' => $request->reason
                ]);
            });

            return response()->json(['message' => 'Peminjaman berhasil dibatalkan']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal membatalkan peminjaman: ' . $e->getMessage()], 500);
        }
    }
}