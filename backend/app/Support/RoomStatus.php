<?php

namespace App\Support;

use App\Models\Booking;
use Carbon\Carbon;

class RoomStatus
{
    /**
     * Ruangan yang sedang dipakai dan jadwal peminjaman berikutnya
     * (hanya dari peminjaman yang sudah disetujui admin).
     *
     * @return array{inUse: \Illuminate\Support\Collection, next: \Illuminate\Support\Collection}
     *         keduanya berkunci room_id
     */
    public static function usage(): array
    {
        $now   = now();
        $today = $now->toDateString();
        $time  = $now->format('H:i:s');

        // Peminjaman disetujui yang belum selesai (hari ini setelah jam sekarang, atau hari berikutnya)
        $approved = Booking::where('status', 'approved')
            ->where(function ($q) use ($today, $time) {
                $q->where('date', '>', $today)
                  ->orWhere(function ($q) use ($today, $time) {
                      $q->where('date', $today)->where('end_time', '>', $time);
                  });
            })
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        $isActive = fn ($b) => Carbon::parse($b->date)->toDateString() === $today
            && $b->start_time <= $time
            && $b->end_time > $time;

        $inUse = $approved->filter($isActive)->unique('room_id')->keyBy('room_id');
        $next  = $approved->reject($isActive)->unique('room_id')->keyBy('room_id');

        return ['inUse' => $inUse, 'next' => $next];
    }
}