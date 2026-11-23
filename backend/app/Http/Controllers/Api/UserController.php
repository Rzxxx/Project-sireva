<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->orderBy('created_at', 'desc')->get();
        return response()->json($users);
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
}
