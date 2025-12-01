<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Affiliate\AffiliateLead;
use App\Models\Affiliate\AffiliateLink;

class AffiliateLeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Membuat data lead dari form yang disubmit pengunjung.
     * Lead dari affiliate link kampanye Kedai Kopi Pandu.
     */
    public function run(): void
    {
        $affiliateLink = AffiliateLink::where('user_id', 1)->first();

        if ($affiliateLink) {
            $leadsData = [
                [
                    'name' => 'Ahmad Ridho',
                    'email' => 'ahmad.ridho@email.com',
                    'whatsapp' => '6282100000001',
                    'interest' => 'Ingin beli franchise',
                    'notes' => 'Tertarik membuka outlet di area Surabaya',
                    'device_type' => 'mobile',
                    'ip_address' => '192.168.1.100',
                    'user_agent' => 'Mozilla/5.0 (iPhone)',
                    'status' => 'baru',
                    'submitted_at' => now()->subDays(5),
                ],
                [
                    'name' => 'Siti Nurhaliza',
                    'email' => 'siti.nur@email.com',
                    'whatsapp' => '6282100000002',
                    'interest' => 'Konsultasi bisnis kafe',
                    'notes' => 'Mau ngomong soal supply chain dan operational',
                    'device_type' => 'desktop',
                    'ip_address' => '192.168.1.101',
                    'user_agent' => 'Mozilla/5.0 (Windows NT)',
                    'status' => 'dihubungi',
                    'submitted_at' => now()->subDays(3),
                ],
                [
                    'name' => 'Budi Santoso',
                    'email' => 'budi.santoso@email.com',
                    'whatsapp' => '6282100000003',
                    'interest' => 'Supplier bahan baku kopi',
                    'notes' => 'Menawarkan kopi specialty import dengan harga kompetitif',
                    'device_type' => 'mobile',
                    'ip_address' => '192.168.1.102',
                    'user_agent' => 'Mozilla/5.0 (Android)',
                    'status' => 'closing',
                    'submitted_at' => now()->subDays(1),
                ],
                [
                    'name' => 'Dewi Lestari',
                    'email' => 'dewi.lestari@email.com',
                    'whatsapp' => '6282100000004',
                    'interest' => 'Partnership program',
                    'notes' => 'Dari kementerian UMKM, ingin kolaborasi program pemberdayaan',
                    'device_type' => 'desktop',
                    'ip_address' => '192.168.1.103',
                    'user_agent' => 'Mozilla/5.0 (Windows NT)',
                    'status' => 'baru',
                    'submitted_at' => now(),
                ],
                [
                    'name' => 'Rafi Firmansyah',
                    'email' => 'rafi.firmansyah@email.com',
                    'whatsapp' => '6282100000005',
                    'interest' => 'Reseller produk coffee',
                    'notes' => 'Ingin jadi reseller untuk area Kediri',
                    'device_type' => 'mobile',
                    'ip_address' => '192.168.1.104',
                    'user_agent' => 'Mozilla/5.0 (iPhone)',
                    'status' => 'dihubungi',
                    'submitted_at' => now()->subDays(2),
                ],
            ];

            foreach ($leadsData as $data) {
                AffiliateLead::create(array_merge($data, [
                    'affiliate_link_id' => $affiliateLink->id,
                ]));
            }
        }
    }
}
