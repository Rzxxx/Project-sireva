<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Halaman Peminjaman: admin melihat reservasi ruangan, mahasiswa melihat riwayatnya
    public function index()
    {
        if (auth()->user()->role === 'admin') {
            $rooms = Room::latest()->get();

            return view('admin.reservasi', compact('rooms'));
        }

        $bookings = Booking::with('room')
            ->where('user_id', auth()->id())
            ->latest('date')
            ->latest('start_time')
            ->get();

        $rooms = Room::where('is_available', true)->get();

        return view('bookings.index', compact('bookings', 'rooms'));
    }

    // Form peminjaman untuk satu ruangan
    public function create(Room $room)
    {
        return view('bookings.create', compact('room'));
    }

    // Simpan pengajuan
    public function store(Request $request, Room $room)
    {
        $data = $request->validate([
            'date'         => ['required', 'date', 'after_or_equal:today'],
            'start_time'   => ['required', 'date_format:H:i'],
            'end_time'     => ['required', 'date_format:H:i', 'after:start_time'],
            'purpose'      => ['required', 'string', 'max:255'],
            'participants' => ['required', 'integer', 'min:1', 'max:' . $room->capacity],
        ]);

        // Cek bentrok jadwal di ruangan yang sama
        $bentrok = Booking::where('room_id', $room->id)
            ->where('date', $data['date'])
            ->whereIn('status', ['pending', 'approved'])
            ->where('start_time', '<', $data['end_time'])
            ->where('end_time', '>', $data['start_time'])
            ->exists();

        if ($bentrok) {
            return back()
                ->withErrors(['start_time' => 'Ruangan sudah dipesan pada jam tersebut.'])
                ->withInput();
        }

        Booking::create($data + [
            'user_id' => $request->user()->id,
            'room_id' => $room->id,
            'status'  => 'pending',
        ]);

        return redirect()->route('bookings.index')
            ->with('success', 'Pengajuan peminjaman berhasil dikirim.');
    }

    // Batalkan pengajuan (hanya yang masih menunggu)
    public function destroy(Booking $booking)
    {
        abort_unless($booking->user_id === auth()->id(), 403);
        abort_unless($booking->status === 'pending', 403);

        $booking->update(['status' => 'cancelled']);

        return redirect()->route('bookings.index')
            ->with('success', 'Peminjaman berhasil dibatalkan.');
    }
}