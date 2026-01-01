import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function Terms({ isDarkMode, toggleDarkMode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-20 overflow-hidden" style={{ background: isDarkMode ? "linear-gradient(135deg, #084404 0%, #167814 50%, #10B517 100%)" : "linear-gradient(135deg, #084404 0%, #167814 50%, #10B517 100%)" }}>
        {/* Background Banner Image */}
        <div className="absolute inset-0 opacity-30">
          <img src="./assets/images/office-bg-2.jpg" alt="" className="object-cover w-full h-full mix-blend-overlay" onError={(e) => (e.target.style.display = "none")} />
        </div>
        
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}></div>
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-[1.1] tracking-tight">
              Syarat dan Ketentuan Layanan
              <span className="block mt-0.5 text-white">
                Grapadi Strategix
              </span>
            </h1>

            <p className="mb-6 text-sm md:text-base font-light leading-relaxed text-white/90 max-w-2xl mx-auto">
              Terakhir Diperbarui: 1 Januari 2026
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="px-4 py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            {/* Introduction */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-0">
                Selamat datang di Grapadi Strategix. Dengan mengakses dan menggunakan platform kami, Anda (selanjutnya disebut "Pengguna") dianggap telah membaca, memahami, dan menyetujui untuk terikat dengan Syarat dan Ketentuan ini.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              
              {/* Section 1 */}
              <div className="border-l-4 border-green-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Definisi Layanan
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Grapadi Strategix menyediakan layanan perangkat lunak berbasis Kecerdasan Buatan (AI) untuk membantu penyusunan rencana bisnis (business plan) dan layanan konsultasi oleh ahli manusia. Layanan ini bertujuan sebagai alat bantu perencanaan, bukan sebagai jaminan keberhasilan bisnis.
                </p>
              </div>

              {/* Section 2 */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Batasan Tanggung Jawab (Limitation of Liability)
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Hasil Berbasis AI:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Pengguna memahami bahwa dokumen yang dihasilkan oleh AI bersifat referensi dan estimasi. Grapadi Strategix tidak bertanggung jawab atas kesalahan data, ketidakakuratan proyeksi, atau kesalahan logika bisnis yang dihasilkan oleh algoritma.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Keputusan Bisnis:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Segala keputusan investasi, operasional, atau keuangan yang diambil berdasarkan dokumen dari Grapadi Strategix adalah tanggung jawab sepenuhnya dari Pengguna. Kami tidak bertanggung jawab atas kerugian finansial, kegagalan bisnis, atau hilangnya kesempatan keuntungan.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Pihak Ketiga:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Grapadi Strategix tidak menjamin bahwa dokumen yang dihasilkan akan diterima oleh bank, investor, atau lembaga pemerintah. Kami tidak bertanggung jawab atas penolakan pendanaan dari pihak ketiga mana pun.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Kepemilikan Kekayaan Intelektual
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Milik Pengguna:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Hak cipta atas ide bisnis, draf dokumen, dan hasil akhir rencana bisnis yang dibuat oleh Pengguna melalui platform sepenuhnya menjadi milik Pengguna.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Milik Grapadi:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Seluruh teknologi, algoritma, desain antarmuka, logo, dan merek "Grapadi Strategix" adalah milik PT Grapadi Konsultan (atau entitas hukum terkait) dan dilindungi oleh undang-undang HAKI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="border-l-4 border-yellow-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Kerahasiaan Data & Informasi (NDA)
                </h2>
                <div className="space-y-4">
                  <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Kami berkomitmen untuk menjaga kerahasiaan input ide bisnis Anda. Data Anda dienkripsi dan tidak akan diberikan kepada pihak ketiga tanpa izin.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Grapadi Strategix berhak menggunakan data anonim (data yang tidak mengidentifikasi individu/perusahaan) untuk keperluan pengembangan algoritma dan peningkatan kualitas layanan tanpa melanggar privasi Pengguna.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="border-l-4 border-red-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Bukan Layanan Penasihat Hukum atau Akuntan Publik
                </h2>
                <div className="space-y-4">
                  <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Layanan Grapadi Strategix (termasuk dukungan ahli) bersifat konsultasi manajemen strategis. Kami tidak menyediakan jasa hukum formal, audit akuntansi publik, atau penasihat pajak.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Pengguna disarankan untuk tetap berkonsultasi dengan ahli hukum atau akuntan bersertifikat untuk kepatuhan regulasi di wilayah masing-masing.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="border-l-4 border-indigo-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Akurasi Proyeksi Keuangan
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Modul keuangan kami menggunakan formula standar akuntansi umum. Namun, karena perbedaan regulasi pajak dan biaya di setiap wilayah/industri, Pengguna wajib melakukan verifikasi mandiri terhadap hasil kalkulasi sebelum menggunakannya untuk laporan resmi.
                </p>
              </div>

              {/* Section 7 */}
              <div className="border-l-4 border-pink-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Kebijakan Pembatalan dan Pengembalian
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Mengingat produk kami adalah produk digital berbasis langganan atau sekali bayar yang memberikan akses instan ke kekayaan intelektual, maka biaya yang telah dibayarkan tidak dapat ditarik kembali (non-refundable), kecuali ditentukan lain oleh kebijakan promo khusus.
                </p>
              </div>

              {/* Section 8 */}
              <div className="border-l-4 border-teal-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Perubahan Ketentuan
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Grapadi Strategix berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan atas platform setelah perubahan tersebut dianggap sebagai persetujuan terhadap ketentuan baru.
                </p>
              </div>

              {/* Section 9 */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Tanggung Jawab Data Keuangan
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Input Data:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Seluruh angka, asumsi, dan data keuangan yang dimasukkan ke dalam platform adalah tanggung jawab sepenuhnya dari Pengguna. Grapadi Strategix tidak melakukan verifikasi atas kebenaran data yang dimasukkan oleh Pengguna.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Hasil Kalkulasi:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Platform kami berfungsi sebagai alat hitung otomatis berdasarkan input dari Pengguna. Hasil proyeksi keuangan (seperti Laba/Rugi, Arus Kas, dan Neraca) sepenuhnya bergantung pada akurasi data yang dimasukkan Pengguna.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Tanggung Jawab Akhir:</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Pengguna mengakui bahwa Grapadi Strategix tidak bertanggung jawab atas kesalahan laporan, kerugian finansial, atau kegagalan investasi yang disebabkan oleh kesalahan input maupun interpretasi hasil proyeksi keuangan tersebut. Dokumen yang dihasilkan adalah draf rencana, bukan laporan keuangan audit resmi.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Section - Full Width */}
          </div>
        </div>
      </section>

      {/* Contact Section - Styled like FAQ - Full Width */}
      <section
        className="relative py-20 md:py-24 lg:py-28 overflow-hidden w-full"
        style={{ background: isDarkMode ? "linear-gradient(135deg, #084404 0%, #167814 50%, #10B517 100%)" : "linear-gradient(135deg, #084404 0%, #167814 50%, #10B517 100%)" }}
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-64 h-64 transform border-4 border-white top-20 left-20 rounded-3xl rotate-12"></div>
          <div className="absolute border-4 border-white rounded-full bottom-20 right-20 w-80 h-80"></div>
          <div className="absolute transform rotate-45 -translate-x-1/2 -translate-y-1/2 border-4 border-white top-1/2 left-1/2 w-96 h-96 rounded-3xl"></div>
        </div>

        <div className="absolute inset-0 opacity-20">
          <img src="/assets/images/office-bg-2.jpg" alt="" className="object-cover w-full h-full mix-blend-overlay" onError={(e) => (e.target.style.display = "none")} />
        </div>

        <div className="relative z-10 w-full">
          <div className="text-center px-4">
            <h2 className="mb-6 text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white">
              Hubungi Kami
            </h2>

            <p className="max-w-2xl mx-auto mb-10 text-base md:text-lg font-light leading-relaxed text-white/95">
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui WhatsApp di{" "}
              <span className="font-semibold text-white">+62 851-9888-7963</span>
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://wa.me/6285198887963"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 text-base font-black transition-all duration-300 transform bg-white shadow-2xl group rounded-md hover:bg-gray-50 hover:scale-105"
                style={{ color: "#167814" }}
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Terms;