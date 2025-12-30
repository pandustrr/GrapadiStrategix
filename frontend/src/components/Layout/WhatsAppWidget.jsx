import { useState } from 'react';
import { FaWhatsapp, FaTimes, FaTelegramPlane } from 'react-icons/fa';

const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const waNumber = "6285198887963";
    const waMessage = encodeURIComponent("Halo Grapadi Strategix, saya ingin bertanya mengenai layanan Anda.");
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Card */}
            <div
                className={`
                    mb-4 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
                `}
            >
                {/* Header */}
                <div className="bg-[#25D366] p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <FaWhatsapp size={24} />
                        <div>
                            <h4 className="font-bold text-sm">Grapadi Support</h4>
                            <p className="text-xs opacity-90">Biasanya membalas cepat</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-white/20 p-1 rounded-full transition-colors"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-x border-b border-gray-100 dark:border-gray-700 rounded-b-lg">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-sm mb-4 inline-block max-w-[85%] border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Halo! 👋 <br />
                            Ada yang bisa kami bantu seputar layanan Grapadi Strategix?
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-1 text-right">Online</span>
                    </div>

                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaWhatsapp size={18} />
                        Mulai Chat
                    </a>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110
                    ${isOpen ? 'bg-gray-600 rotate-90' : 'bg-[#25D366] hover:bg-[#128C7E] rotate-0'}
                `}
                aria-label="Toggle WhatsApp Chat"
            >
                {isOpen ? (
                    <FaTimes size={24} className="text-white" />
                ) : (
                    <FaWhatsapp size={32} className="text-white" />
                )}

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>
        </div>
    );
};

export default WhatsAppWidget;
