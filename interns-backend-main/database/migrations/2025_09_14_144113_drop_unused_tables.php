<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop unused tables
        Schema::dropIfExists('messages');
        Schema::dropIfExists('usermessages');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('usermanagements');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: We cannot recreate these tables as we don't have their original structure
        // This migration is irreversible by design
    }
};
