import { useState, useEffect } from "react";
import {
    DollarSign,
    PieChart,
    TrendingUp,
    BarChart3,
    FileText,
    CreditCard,
    Settings,
    Plus,
    Folder,
    Calculator
} from "lucide-react";
import FinancialCategories from "../components/ManagementFinancial/FinancialCategories/FinancialCategories";
import FinancialSummaries from "../components/ManagementFinancial/FinancialSummaries/FinancialSummaries";


const ManagementFinancial = ({ activeSubSection, setActiveSubSection }) => {
    const [view, setView] = useState("main");

    // Sync view dengan activeSubSection dari parent
    useEffect(() => {
        if (activeSubSection) {
            setView(activeSubSection);
        } else {
            setView("main");
        }
    }, [activeSubSection]);

    const handleSubSectionClick = (subSectionId) => {
        setActiveSubSection(subSectionId);
        setView(subSectionId);
    };

    const handleBackToMain = () => {
        setActiveSubSection("");
        setView("main");
    };

    const renderMainView = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Manajemen Keuangan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Kelola semua aspek keuangan bisnis Anda secara terintegrasi
                </p>
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Kategori</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Folder className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendapatan</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">Rp 0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengeluaran</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">Rp 0</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-red-600 dark:text-red-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Rp 0</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Calculator className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Kategori Keuangan Card */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300 dark:hover:border-blue-600"
                    onClick={() => handleSubSectionClick("financial-categories")}
                >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Folder className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Kategori Keuangan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Kelola kategori pendapatan dan pengeluaran untuk organisasi keuangan yang lebih baik
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                        <span>Kelola Kategori</span>
                        <svg
                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Ringkasan Keuangan Card */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-teal-300 dark:hover:border-teal-600"
                    onClick={() => handleSubSectionClick("financial-summaries")}
                >
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="text-teal-600 dark:text-teal-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Ringkasan Keuangan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Lihat ringkasan pendapatan, pengeluaran, dan laba bulanan dengan grafik analisis
                    </p>
                    <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium">
                        <span>Lihat Ringkasan</span>
                        <svg
                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    );

    const renderSubSection = () => {
        switch (view) {
            case 'financial-categories':
                return <FinancialCategories onBack={handleBackToMain} />;
            // Tambahkan case lain untuk sub-section lainnya
            case 'financial-summaries':
                return <FinancialSummaries onBack={handleBackToMain} />;
            default:
                return renderMainView();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderSubSection()}
            </div>
        </div>
    );
};

export default ManagementFinancial;