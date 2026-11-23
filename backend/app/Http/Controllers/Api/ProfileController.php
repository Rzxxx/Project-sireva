<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil berhasil diperbarui', 
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ]
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Password saat ini salah'], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json(['message' => 'Password berhasil diubah']);
    }
}