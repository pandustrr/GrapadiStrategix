import React from 'react'
import { Plus, FileText, BarChart3, TrendingUp, Download, Share2 } from 'lucide-react'

const QuickActions = () => {
    const actions = [
        {
            icon: Plus,
            label: 'Buat Rencana Baru',
            description: 'Mulai perencanaan bisnis baru',
            color: 'bg-green-500 hover:bg-green-600',
            onClick: () => console.log('Buat rencana baru')
        },
        {
            icon: FileText,
            label: 'Modul Keuangan',
            description: 'Kelola keuangan bisnis',
            color: 'bg-blue-500 hover:bg-blue-600',
            onClick: () => console.log('Buka modul keuangan')
        },
        {
            icon: BarChart3,
            label: 'Analisis Bisnis',
            description: 'Lihat analisis mendalam',
            color: 'bg-purple-500 hover:bg-purple-600',
            onClick: () => console.log('Buka analisis')
        },
        {
            icon: TrendingUp,
            label: 'Forecast',
            description: 'Prediksi masa depan bisnis',
            color: 'bg-orange-500 hover:bg-orange-600',
            onClick: () => console.log('Buka forecast')
        }
    ]

    const quickLinks = [
        { icon: Download, label: 'Export Laporan', color: 'text-gray-600' },
        { icon: Share2, label: 'Bagikan Dashboard', color: 'text-gray-600' }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`flex items-center space-x-3 p-4 text-white rounded-lg transition-all duration-200 transform hover:scale-105 ${action.color}`}
                            >
                                <Icon size={20} />
                                <div className="text-left">
                                    <p className="font-medium">{action.label}</p>
                                    <p className="text-sm opacity-90">{action.description}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tautan Cepat</h2>
                <div className="space-y-3">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon
                        return (
                            <button
                                key={index}
                                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <Icon size={20} className={link.color} />
                                <span className="font-medium">{link.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Recent Activity */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Aktivitas Terbaru</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">• Rencana "Ekspansi 2024" diperbarui</p>
                        <p className="text-sm text-gray-600">• Laporan keuangan November diunggah</p>
                        <p className="text-sm text-gray-600">• Forecast Q4 diselesaikan</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickActions