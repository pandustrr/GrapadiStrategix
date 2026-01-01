import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white py-12 md:py-16 px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-900/5 dark:bg-green-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-900/5 dark:bg-green-900/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              <span style={{ color: "#167814" }}>Grapadi</span> Strategix
            </h3>
            <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              PT. Grapadi Sejahtera Mandiri
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 italic">
              Commited to Accurate and Quality
            </p>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-md text-xs md:text-sm">
              Platform manajemen bisnis all-in-one yang dirancang untuk membantu bisnis Anda tumbuh lebih cepat dengan analisis AI, perencanaan strategis, dan manajemen keuangan yang powerful.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
              {/* Head Office */}
              <div className="flex items-start gap-2 md:gap-3 text-gray-600 dark:text-gray-400 group">
                <MapPin size={16} className="mt-0.5 md:mt-1 flex-shrink-0 text-green-700 dark:text-green-500" />
                <div>
                  <span className="font-semibold block text-gray-900 dark:text-white mb-1">Alamat:</span>
                  <span>Apartemen The Habitat HC20, Bencongan Indah, Kec. Klp. Dua, Kabupaten Tangerang, Banten 15000</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FaWhatsapp size={16} className="text-green-700 dark:text-green-500" />
                <a href="https://wa.me/6285198887963" target="_blank" rel="noopener noreferrer">62851-9888-7963</a>
              </div>

            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-base md:text-lg">Produk</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
              <li>
                <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Perencanaan Bisnis
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Manajemen Keuangan
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Forecast & Prediksi AI
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Laporan Otomatis & PDF
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Program Afiliasi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 dark:border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Copyright */}
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm text-center md:text-left">
              <p>&copy; 2025 PT. Grapadi Sejahtera Mandiri. All rights reserved.</p>
              <p className="mt-1">
                Built with <span style={{ color: "#167814" }}>❤</span> by Grapadi Strategix Team
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 md:gap-4">
              <a href="https://www.linkedin.com/in/andika-pujangkoro-se-mecdev-682a68293/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-[#0077b5] hover:text-white flex items-center justify-center transition-all hover:scale-110" aria-label="LinkedIn">
                <FaLinkedin size={16} />
              </a>
              <a href="https://www.instagram.com/grapadibusinessclinic/?utm_source=qr&igsh=a3FkZHQ3eXV5cHNl#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white flex items-center justify-center transition-all hover:scale-110" aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="https://www.tiktok.com/@ruangbisnisberkembang?_t=8s9vsjSstW6&_r=1" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-black hover:text-white flex items-center justify-center transition-all hover:scale-110" aria-label="TikTok">
                <FaTiktok size={16} />
              </a>
              <a href="https://www.youtube.com/@Grapadiinsight" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all hover:scale-110" aria-label="YouTube">
                <FaYoutube size={16} />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
              <Link to="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
