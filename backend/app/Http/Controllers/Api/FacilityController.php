<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Facility;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = Facility::orderBy('created_at', 'desc')->get();
        return response()->json($facilities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $facility = Facility::create($validated);
        return response()->json(['message' => 'Fasilitas berhasil ditambahkan', 'data' => $facility], 201);
    }

    public function destroy($id)
    {
        $facility = Facility::findOrFail($id);
        $facility->delete();
        return response()->json(['message' => 'Fasilitas berhasil dihapus']);
    }
}
