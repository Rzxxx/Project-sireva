<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rute Login untuk Publik
Route::post('/login', [AuthController::class, 'login']);

// Rute Umum untuk semua Role
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    Route::get('/facilities', [FacilityController::class, 'index']);
});

 // Fitur Peminjaman (Hanya Mahasiswa & Dosen)
Route::middleware(['auth:sanctum', 'role:Mahasiswa|Dosen'])->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
});

// Rute Admin
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::post('/facilities', [FacilityController::class, 'store']);
    Route::delete('/facilities/{id}', [FacilityController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// Rute Petugas
Route::middleware(['auth:sanctum', 'role:Petugas'])->group(function () {
    Route::get('/bookings/pending', [BookingController::class, 'pendingBookings']);
    Route::put('/bookings/{id}/process', [BookingController::class, 'processBooking']);
});
