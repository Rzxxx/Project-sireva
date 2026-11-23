<?php

use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Login & register: hanya untuk yang belum login
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

// Halaman untuk user yang sudah login
Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        $rooms = Room::where('is_available', true)->latest()->get();

        return view('home', compact('rooms'));
    })->name('home');

    Route::get('/rooms/{room}/book', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/rooms/{room}/book', [BookingController::class, 'store'])->name('bookings.store');

    Route::get('/peminjaman', [BookingController::class, 'index'])->name('bookings.index');
    Route::delete('/peminjaman/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/password', [ProfileController::class, 'password'])->name('profile.password');

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    })->name('logout');
});

// Khusus admin
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('rooms', RoomController::class)->except('show');
    Route::patch('rooms/{room}/toggle', [RoomController::class, 'toggle'])->name('rooms.toggle');
    Route::post('rooms/{room}/photo', [RoomController::class, 'photo'])->name('rooms.photo');

    Route::get('bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::patch('bookings/{booking}/approve', [AdminBookingController::class, 'approve'])->name('bookings.approve');
    Route::patch('bookings/{booking}/reject', [AdminBookingController::class, 'reject'])->name('bookings.reject');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::patch('users/{user}/role', [UserController::class, 'role'])->name('users.role');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});