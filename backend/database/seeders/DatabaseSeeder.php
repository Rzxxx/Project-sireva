<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Petugas', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Mahasiswa', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Dosen', 'guard_name' => 'web']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@sireva.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password123'),
            ]
        );

        $admin->assignRole('Admin');

        $testUser = User::firstOrCreate(
            ['email' => 'test@user.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('testing123'),
            ]
        );
        $testUser->assignRole('Mahasiswa');
    }
}
