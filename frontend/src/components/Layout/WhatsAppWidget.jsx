import { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        notes: ''
    });

    const waNumber = "6285198887963";

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = encodeURIComponent(
            `Halo Admin Grapadi Strategix,\n\n` +
            `Saya ingin bertanya:\n` +
            `Nama: ${formData.name}\n` +
            `No. HP: ${formData.phone}\n` +
            `Pesan: ${formData.notes}`
        );
        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
        setIsOpen(false);
        setFormData({ name: '', phone: '', notes: '' });
    };

    return (
        <>
            {/* Modal & Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300">
                    {/* Darker/Lighter Backdrop with very subtle blur */}
                    <div
                        className="absolute inset-0 bg-black/30 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Form Container - Reduced size and padding */}
                    <div className="relative bg-white dark:bg-gray-800 w-full max-w-[340px] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-4 flex flex-col items-center relative border-b border-gray-50 dark:border-gray-700">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaTimes size={16} />
                            </button>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mt-2">Hubungi Admin</h3>
                        </div>

                        {/* Form Body - Reduced padding and spacing */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition-all dark:text-white text-sm"
                                    placeholder="Nama lengkap"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition-all dark:text-white text-sm"
                                    placeholder="Nomor WhatsApp"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Notes</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition-all resize-none dark:text-white text-sm"
                                    placeholder="Pertanyaan Anda"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-[#FF7A00] hover:bg-[#FF8A1F] text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Side Hanging Button */}
            <div className={`
                fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300
                ${isOpen ? 'translate-x-full' : 'translate-x-0'}
            `}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative bg-[#25D366] hover:bg-[#128C7E] text-white p-3 pl-5 rounded-l-3xl shadow-xl flex items-center justify-center transition-all border-y border-l border-white/20"
                    aria-label="Contact Admin"
                >
                    <FaWhatsapp size={32} className="animate-bounce group-hover:animate-none" />
                    <span className="absolute right-full mr-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-lg pointer-events-none">
                        Hubungi Admin
                    </span>
                </button>
            </div>
        </>
    );
};

export default WhatsAppWidget;
