<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::latest()->get();

        return view('admin.rooms.index', compact('rooms'));
    }

    public function create()
    {
        return view('admin.rooms.form');
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['image'] = $this->uploadImage($request);

        Room::create($data);

        return redirect()->route('bookings.index')
            ->with('success', 'Ruangan berhasil ditambahkan.');
    }

    public function edit(Room $room)
    {
        return view('admin.rooms.form', compact('room'));
    }

    public function update(Request $request, Room $room)
    {
        $data = $this->validated($request);

        if ($path = $this->uploadImage($request)) {
            $this->deleteImage($room->image);
            $data['image'] = $path;
        }

        $room->update($data);

        return redirect()->route('bookings.index')
            ->with('success', 'Ruangan berhasil diperbarui.');
    }

    public function destroy(Room $room)
    {
        $this->deleteImage($room->image);
        $room->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Ruangan berhasil dihapus.');
    }

    // Ubah status tersedia / tidak tersedia
    public function toggle(Room $room)
    {
        $room->update(['is_available' => ! $room->is_available]);

        return back()->with('success', $room->name . ' sekarang ' . ($room->is_available ? 'tersedia' : 'tidak tersedia') . '.');
    }

    // Upload / ganti foto langsung dari kartu ruangan
    public function photo(Request $request, Room $room)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $path = $this->uploadImage($request);
        $this->deleteImage($room->image);
        $room->update(['image' => $path]);

        return back()->with('success', 'Foto ' . $room->name . ' berhasil diperbarui.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'image'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        unset($data['image']);
        $data['is_available'] = $request->boolean('is_available');

        return $data;
    }

    private function uploadImage(Request $request): ?string
    {
        if (! $request->hasFile('image')) {
            return null;
        }

        $file = $request->file('image');
        $name = Str::uuid() . '.' . $file->extension();
        $file->move(public_path('images/rooms'), $name);

        return 'images/rooms/' . $name;
    }

    private function deleteImage(?string $path): void
    {
        if ($path && str_starts_with($path, 'images/rooms/') && file_exists(public_path($path))) {
            @unlink(public_path($path));
        }
    }
}