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
        Schema::create('product_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('business_background_id')->nullable()->constrained('business_backgrounds')->onDelete('cascade');

            $table->enum('type', ['product', 'service'])->default('product');
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 12, 2)->nullable();
            $table->string('image_path')->nullable();
            $table->text('advantages')->nullable();
            $table->text('development_strategy')->nullable();
            $table->enum('status', ['draft', 'in_development', 'launched'])->default('draft');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_services');
    }
};
