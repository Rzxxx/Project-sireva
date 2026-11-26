<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:Admin,Petugas,Mahasiswa,Dosen',
            'identity_number' => 'nullable|string|max:50',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'identity_number' => $validated['identity_number'],
        ]);

        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan',
            'user' => $user->load('roles')
        ], 201);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:Admin,Petugas,Mahasiswa,Dosen'
        ]);

        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Anda tidak bisa mengubah role Anda sendiri'], 403);
        }

        $user->syncRoles($request->role);

        return response()->json(['message' => 'Role berhasil diperbarui']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Anda tidak bisa menghapus akun Anda sendiri'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Pengguna berhasil dihapus']);
    }
}
