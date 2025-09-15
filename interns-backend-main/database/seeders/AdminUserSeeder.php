<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Ensure users table exists
        if (!Schema::hasTable('users')) return;

        // Insert or update admin user
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@hawi.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@hawi.com',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'profile_picture' => 'admin-profile.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}