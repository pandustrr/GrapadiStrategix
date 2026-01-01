import { useState } from "react";
import { ChevronDown, Zap, Target, Users, CheckCircle, TrendingUp } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function FAQ({ isDarkMode, toggleDarkMode }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categoryIcons = {
    "Tentang Produk": Zap,
    "Proses & Fitur": Target,
    "Dukungan Ahli": Users,
    "Keamanan & Teknis": CheckCircle,
  };

  const faqData = [
    {
      category: "Tentang Produk",
      questions: [
        {
          q: "Apa itu Grapadi Strategix?",
          a: "Grapadi Strategix adalah platform perencanaan bisnis berbasis AI yang membantu pengusaha menyusun dokumen Business Plan profesional secara otomatis, cepat, dan akurat sesuai standar industri.",
        },
        {
          q: "Apakah rencana bisnis yang dihasilkan AI cukup akurat?",
          a: "Ya. AI kami dilatih menggunakan metodologi konsultasi bisnis yang teruji. Namun, yang membedakan kami adalah adanya opsi pendampingan dari ahli berpengalaman untuk memvalidasi dan menyempurnakan draf tersebut agar benar-benar siap pakai.",
        },
      ],
    },
    {
      category: "Proses & Fitur",
      questions: [
        {
          q: "Berapa lama waktu yang dibutuhkan untuk membuat satu Business Plan?",
          a: "Dengan teknologi AI kami, draf awal rencana bisnis Anda bisa selesai dalam hitungan menit setelah Anda menginput informasi dasar mengenai ide bisnis Anda.",
        },
        {
          q: "Apakah saya bisa mengubah dokumen setelah dihasilkan oleh AI?",
          a: "Tentu saja. Anda memiliki kendali penuh untuk mengedit, menambah, atau menyesuaikan setiap bagian dari dokumen tersebut melalui dashboard yang intuitif.",
        },
        {
          q: "Apa saja yang termasuk dalam dokumen Business Plan-nya?",
          a: "Dokumen mencakup analisis pasar, strategi pemasaran, rencana operasional, hingga proyeksi keuangan (laba rugi, arus kas, dan neraca) yang komprehensif.",
        },
      ],
    },
    {
      category: "Dukungan Ahli",
      questions: [
        {
          q: "Bagaimana cara saya mendapatkan bantuan dari ahli berpengalaman?",
          a: "Kami menyediakan sesi konsultasi atau peninjauan dokumen oleh tim konsultan senior kami (tergantung paket layanan yang Anda pilih) untuk memastikan strategi Anda memiliki landasan yang kuat.",
        },
        {
          q: "Apakah saya tetap butuh konsultan jika sudah pakai AI?",
          a: "AI sangat membantu dalam kecepatan dan struktur data. Namun, peran ahli kami adalah memberikan insight strategis dan sentuhan personal yang seringkali menjadi penentu keberhasilan saat berhadapan dengan investor atau bank.",
        },
      ],
    },
    {
      category: "Keamanan & Teknis",
      questions: [
        {
          q: "Apakah data ide bisnis saya aman?",
          a: "Keamanan data adalah prioritas kami. Semua informasi yang Anda masukkan dienkripsi secara ketat dan tidak akan dibagikan kepada pihak ketiga manapun.",
        },
        {
          q: "Dapatkah saya mengunduh hasilnya dalam format apa?",
          a: "Hasil rencana bisnis Anda dapat diunduh dalam format profesional seperti PDF atau Word, sehingga siap untuk langsung dipresentasikan atau dicetak.",
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
              Pertanyaan yang Sering Diajukan
              <span className="block mt-0.5 text-white">
                (FAQ)
              </span>
            </h1>

            <p className="mb-6 text-sm md:text-base font-light leading-relaxed text-white/90 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang Grapadi Strategix, fitur-fitur kami, dan bagaimana platform kami dapat membantu kesuksesan bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="px-4 py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          {faqData.map((section, sectionIndex) => {
            const IconComponent = categoryIcons[section.category];
            const categoryColors = {
              "Tentang Produk": { light: "#FF6B6B", lightBg: "rgba(255, 107, 107, 0.1)", dark: "#FF6B6B", darkBg: "rgba(255, 107, 107, 0.15)" },
              "Proses & Fitur": { light: "#4ECDC4", lightBg: "rgba(78, 205, 196, 0.1)", dark: "#4ECDC4", darkBg: "rgba(78, 205, 196, 0.15)" },
              "Dukungan Ahli": { light: "#95E1D3", lightBg: "rgba(149, 225, 211, 0.1)", dark: "#95E1D3", darkBg: "rgba(149, 225, 211, 0.15)" },
              "Keamanan & Teknis": { light: "#6C63FF", lightBg: "rgba(108, 99, 255, 0.1)", dark: "#6C63FF", darkBg: "rgba(108, 99, 255, 0.15)" },
            };
            
            const colors = categoryColors[section.category];
            const iconColor = isDarkMode ? colors.dark : colors.light;
            const bgColor = isDarkMode ? colors.darkBg : colors.lightBg;
            
            return (
              <div key={sectionIndex} className="mb-16">
                <div className="flex items-center gap-4 mb-8 group/header">
                  <div 
                    className="p-3 rounded-xl transition-all duration-500 transform group/header-hover:scale-110 relative overflow-hidden shadow-md hover:shadow-lg" 
                    style={{ 
                      backgroundColor: bgColor,
                      border: `1px solid ${iconColor}40`,
                      boxShadow: `0 4px 8px ${iconColor}20`
                    }}
                  >
                    {/* Animated background gradient */}
                    <div 
                      className="absolute inset-0 opacity-0 group/header-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${iconColor}10 0%, transparent 70%)`
                      }}
                    ></div>
                    
                    <IconComponent 
                      size={24} 
                      strokeWidth={2}
                      className="transition-all duration-500 transform group/header-hover:rotate-12 relative z-10"
                      style={{ color: iconColor }} 
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300" style={{ color: iconColor }}>
                      {section.category}
                    </h2>
                    <div 
                      className="h-1 w-12 mt-2 rounded-full transition-all duration-300 group/header-hover:w-16" 
                      style={{ backgroundColor: iconColor }}
                    ></div>
                  </div>
                </div>

              <div className="space-y-3">
                {section.questions.map((item, questionIndex) => {
                  const globalIndex = sectionIndex * 10 + questionIndex;
                  const isExpanded = expandedIndex === globalIndex;
                  const categoryColors = {
                    "Tentang Produk": { light: "#FF6B6B", dark: "#FF6B6B" },
                    "Proses & Fitur": { light: "#4ECDC4", dark: "#4ECDC4" },
                    "Dukungan Ahli": { light: "#95E1D3", dark: "#95E1D3" },
                    "Keamanan & Teknis": { light: "#6C63FF", dark: "#6C63FF" },
                  };
                  
                  const colors = categoryColors[section.category];
                  const accentColor = isDarkMode ? colors.dark : colors.light;

                  return (
                    <div
                      key={questionIndex}
                      className="border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 group/item"
                      style={{
                        borderColor: isExpanded ? accentColor : (isDarkMode ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)"),
                        boxShadow: isExpanded
                          ? `0 10px 25px ${accentColor}25`
                          : "none",
                        backgroundColor: isExpanded ? (isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.5)") : ""
                      }}
                    >
                      <button
                        onClick={() => toggleAccordion(globalIndex)}
                        className="w-full px-6 py-5 text-left hover:bg-opacity-50 transition-colors duration-200 flex items-center justify-between"
                        style={{
                          backgroundColor: isExpanded ? (isDarkMode ? `${accentColor}10` : `${accentColor}08`) : "transparent",
                        }}
                      >
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200 flex-1" style={{ color: isExpanded ? accentColor : "" }}>
                          {item.q}
                        </h3>
                        <ChevronDown
                          size={20}
                          className="flex-shrink-0 transition-all duration-300 ml-4"
                          style={{
                            color: isExpanded ? accentColor : (isDarkMode ? "#9CA3AF" : "#6B7280"),
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </button>

                      {isExpanded && (
                        <div 
                          className="px-6 py-5 border-t-2 transition-all duration-300"
                          style={{ 
                            borderColor: `${accentColor}30`,
                            backgroundColor: isDarkMode ? `${accentColor}08` : `${accentColor}05`
                          }}
                        >
                          <p className="text-xs md:text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-light">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative px-4 py-16 overflow-hidden"
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

        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
              Masih Ada Pertanyaan?
            </h2>

            <p className="max-w-2xl mx-auto mb-8 text-sm md:text-base font-light leading-relaxed text-white/95">
              Tim support kami siap membantu Anda. Hubungi kami melalui WhatsApp untuk konsultasi gratis dan respon cepat dalam 30 menit.
            </p>

            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <a
                href="https://wa.me/6285198887963"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-black transition-all duration-300 transform bg-white shadow-2xl group rounded-md hover:bg-gray-50 hover:scale-105"
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

export default FAQ;
