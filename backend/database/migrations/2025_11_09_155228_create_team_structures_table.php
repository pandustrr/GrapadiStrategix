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
        Schema::create('team_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('business_background_id')->constrained()->onDelete('cascade');

            $table->string('team_category')->nullable(); // Tim Backend, Tim Produksi, dsb
            $table->string('member_name');
            $table->string('position');
            $table->text('experience')->nullable(); // latar belakang
            $table->string('photo')->nullable(); // foto atau struktur organisasi (opsional)

            $table->enum('status', ['draft', 'active'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_structures');
    }
};
