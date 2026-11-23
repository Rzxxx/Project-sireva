<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Daftar pengguna, bisa dicari berdasarkan nama atau email
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $users = User::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($w) use ($q) {
                    $w->where('name', 'like', "%{$q}%")
                      ->orWhere('email', 'like', "%{$q}%");
                });
            })
            ->orderByRaw("role = 'admin' desc")
            ->orderBy('name')
            ->get();

        $bookingCounts = Booking::selectRaw('user_id, count(*) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        return view('admin.users.index', compact('users', 'q', 'bookingCounts'));
    }

    // Ubah peran: mahasiswa <-> admin
    public function role(User $user)
    {
        abort_if($user->id === auth()->id(), 403, 'Tidak bisa mengubah peran akun sendiri.');

        $user->role = $user->role === 'admin' ? 'mahasiswa' : 'admin';
        $user->save();

        return back()->with('success', 'Peran ' . $user->name . ' sekarang ' . ($user->role === 'admin' ? 'Admin' : 'Mahasiswa') . '.');
    }

    // Hapus akun
    public function destroy(User $user)
    {
        abort_if($user->id === auth()->id(), 403, 'Tidak bisa menghapus akun sendiri.');

        $name = $user->name;
        $user->delete();

        return back()->with('success', 'Akun ' . $name . ' berhasil dihapus.');
    }
}