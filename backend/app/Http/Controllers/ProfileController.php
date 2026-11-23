<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total'    => Booking::where('user_id', $user->id)->count(),
            'pending'  => Booking::where('user_id', $user->id)->where('status', 'pending')->count(),
            'approved' => Booking::where('user_id', $user->id)->where('status', 'approved')->count(),
        ];

        return view('profile.edit', compact('user', 'stats'));
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        $user->update($data);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function password(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password berhasil diubah.');
    }
}