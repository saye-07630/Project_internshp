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
        Schema::table('user_service_requests', function (Blueprint $table) {
            $table->string('category')->nullable()->after('priority');
            $table->string('projectRelated')->nullable()->after('category');
            $table->string('urgency')->nullable()->after('projectRelated');
            $table->string('expectedResolution')->nullable()->after('urgency');
            $table->text('additionalNotes')->nullable()->after('expectedResolution');
            $table->json('feedback')->nullable()->after('additionalNotes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_service_requests', function (Blueprint $table) {
            $table->dropColumn(['category', 'projectRelated', 'urgency', 'expectedResolution', 'additionalNotes', 'feedback']);
        });
    }
};
