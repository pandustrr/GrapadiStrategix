<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BusinessBackgroundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $businessBackgrounds = [
            [
                'user_id' => 1, // Sesuaikan dengan ID user yang ada
                'logo' => 'logos/tech-company-logo.png',
                'name' => 'Tech Innovasi Indonesia',
                'category' => 'Technology',
                'description' => 'Perusahaan teknologi yang fokus pada pengembangan solusi digital inovatif untuk UMKM Indonesia.',
                'purpose' => 'Membantu UMKM Indonesia bertransformasi digital dengan solusi yang terjangkau dan mudah digunakan.',
                'location' => 'Jakarta, Indonesia',
                'business_type' => 'PT',
                'start_date' => '2020-01-15',
                'values' => 'Integritas, Inovasi, Kolaborasi, Customer-centric',
                'vision' => 'Menjadi perusahaan teknologi terdepan dalam mendorong transformasi digital UMKM di Indonesia',
                'mission' => '1. Mengembangkan solusi teknologi yang mudah diakses\n2. Memberikan pelayanan terbaik kepada pelanggan\n3. Berinovasi terus menerus dalam produk dan layanan',
                'contact' => 'instagram: @techinnovasi, email: hello@techinnovasi.id, whatsapp: +628123456789',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 2,
                'logo' => 'logos/coffee-shop-logo.jpg',
                'name' => 'Kopi Nusantara',
                'category' => 'Food & Beverage',
                'description' => 'Kedai kopi yang menyajikan biji kopi premium dari berbagai daerah di Indonesia dengan konsep modern.',
                'purpose' => 'Memperkenalkan kekayaan rasa kopi Indonesia kepada generasi muda dengan cara yang modern.',
                'location' => 'Bandung, Indonesia',
                'business_type' => 'CV',
                'start_date' => '2019-08-10',
                'values' => 'Kualitas, Keramahan, Keaslian, Komunitas',
                'vision' => 'Menjadi kedai kopi terdepan dalam melestarikan dan mempromosikan kopi Indonesia',
                'mission' => '1. Menyajikan kopi dengan kualitas terbaik\n2. Menciptakan pengalaman ngopi yang menyenangkan\n3. Mendukung petani kopi lokal',
                'contact' => 'instagram: @kopinusantara, email: info@kopinusantara.com, whatsapp: +628987654321',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('business_backgrounds')->insert($businessBackgrounds);
    }
}
