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

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/facilities', [FacilityController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
});

Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::post('/facilities', [FacilityController::class, 'store']);
    Route::delete('/facilities/{id}', [FacilityController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
});

Route::middleware(['auth:sanctum', 'role:Petugas|Admin'])->group(function () {
    Route::put('/bookings/{id}/approve', [BookingController::class, 'approve']);
    Route::get('/bookings/pending', [BookingController::class, 'pendingBookings']);
    Route::put('/bookings/{id}/process', [BookingController::class, 'processBooking']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/facilities', [FacilityController::class, 'index']);
    Route::middleware('role:Admin|Petugas')->group(function () {
        Route::post('/facilities', [FacilityController::class, 'store']);
        Route::delete('/facilities/{id}', [FacilityController::class, 'destroy']);
    });
});
