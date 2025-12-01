<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Affiliate\AffiliateTrack;
use App\Models\Affiliate\AffiliateLink;

class AffiliateTrackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Membuat data tracking untuk link yang diklik.
     * Simulasi data klik dari pengunjung.
     */
    public function run(): void
    {
        $affiliateLink = AffiliateLink::where('user_id', 1)->first();

        if ($affiliateLink) {
            // Simulasi 10 klik dari pengunjung berbeda
            for ($i = 1; $i <= 10; $i++) {
                AffiliateTrack::create([
                    'affiliate_link_id' => $affiliateLink->id,
                    'device_type' => $i % 3 === 0 ? 'mobile' : 'desktop',
                    'ip_address' => '192.168.' . rand(1, 255) . '.' . rand(1, 255),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'browser' => $i % 2 === 0 ? 'Chrome' : 'Firefox',
                    'os' => 'Windows',
                    'referrer' => $i % 3 === 0 ? 'facebook.com' : 'google.com',
                    'tracked_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
}
