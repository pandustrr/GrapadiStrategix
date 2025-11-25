import { useState, useEffect } from 'react';
import SummaryList from './Summary-List';
import SummaryCreate from './Summary-Create';
import SummaryEdit from './Summary-Edit';
import SummaryView from './Summary-View';
import YearManager from './Year-Manager';
import { managementFinancialApi } from '../../../services/managementFinancial';

const FinancialSummaries = ({ onBack }) => {
    const [summaries, setSummaries] = useState([]);
    const [currentSummary, setCurrentSummary] = useState(null);
    const [view, setView] = useState('list'); // Default langsung ke list
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [availableYears, setAvailableYears] = useState([currentYear]);

    // Load available years dari summaries yang ada
    useEffect(() => {
        if (summaries.length > 0) {
            const yearsFromSummaries = [...new Set(summaries.map(s => s.year))];
            const allYears = [...new Set([...availableYears, ...yearsFromSummaries, currentYear])];
            setAvailableYears(allYears.sort((a, b) => b - a));
        }
    }, [summaries]);

    // Fetch semua summaries
    const fetchSummaries = async (year = selectedYear) => {
        try {
            setIsLoading(true);
            setError(null);

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('User data not found. Please login again.');
            }

            const businesses = JSON.parse(localStorage.getItem('user_businesses') || '[]');
            const businessId = businesses[0]?.id;

            const params = {
                user_id: user.id,
                year: year
            };

            if (businessId) {
                params.business_id = businessId;
            }

            console.log('Fetching financial summaries for year:', year);
            const response = await managementFinancialApi.summaries.getAll(params);

            if (response.data && response.data.status === 'success') {
                setSummaries(response.data.data || []);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch summaries');
            }
        } catch (error) {
            console.error('Error fetching summaries:', error);
            
            let errorMessage = 'Gagal memuat data ringkasan keuangan';
            if (error.response?.status === 500) {
                errorMessage = 'Server error: Silakan coba lagi nanti.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaries(selectedYear);
    }, [selectedYear]);

    // Handler untuk year management
    const handleAddYear = async (newYear) => {
        if (!availableYears.includes(newYear)) {
            setAvailableYears(prev => [...prev, newYear].sort((a, b) => b - a));
            setSelectedYear(newYear);
            
            // Simpan ke localStorage untuk persistensi
            const userYears = JSON.parse(localStorage.getItem('user_years') || '[]');
            localStorage.setItem('user_years', JSON.stringify([...userYears, newYear]));
        }
    };

    const handleDeleteYear = async (yearToDelete) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            // Delete semua summary di tahun tersebut dari database
            const summariesInYear = summaries.filter(s => s.year === yearToDelete);
            for (const summary of summariesInYear) {
                await managementFinancialApi.summaries.delete(summary.id, user.id);
            }

            // Update available years
            const newAvailableYears = availableYears.filter(year => year !== yearToDelete);
            setAvailableYears(newAvailableYears);
            
            // Update selected year
            const newSelectedYear = newAvailableYears.includes(currentYear) ? currentYear : newAvailableYears[0];
            setSelectedYear(newSelectedYear);

            // Update localStorage
            localStorage.setItem('user_years', JSON.stringify(newAvailableYears));

            // Refresh data
            await fetchSummaries(newSelectedYear);
            
        } catch (error) {
            console.error('Error deleting year:', error);
            throw error;
        }
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setError(null);
    };

    // Load available years dari localStorage saat initial load
    useEffect(() => {
        const loadAvailableYears = () => {
            try {
                const savedYears = JSON.parse(localStorage.getItem('user_years'));
                if (savedYears && savedYears.length > 0) {
                    setAvailableYears(savedYears.sort((a, b) => b - a));
                } else {
                    // Default years
                    const defaultYears = [currentYear, currentYear - 1, currentYear + 1];
                    setAvailableYears(defaultYears);
                    localStorage.setItem('user_years', JSON.stringify(defaultYears));
                }
            } catch (error) {
                console.error('Error loading years from localStorage:', error);
                const defaultYears = [currentYear, currentYear - 1, currentYear + 1];
                setAvailableYears(defaultYears);
            }
        };

        loadAvailableYears();
    }, []);

    // Handler functions
    const handleCreateNew = () => {
        setCurrentSummary(null);
        setView('create');
    };

    const handleView = (summary) => {
        setCurrentSummary(summary);
        setView('view');
    };

    const handleEdit = (summary) => {
        setCurrentSummary(summary);
        setView('edit');
    };

    const handleDelete = async (summaryId) => {
        try {
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await managementFinancialApi.summaries.delete(summaryId, user.id);

            if (response.data.status === 'success') {
                await fetchSummaries();
            } else {
                throw new Error(response.data.message || 'Failed to delete summary');
            }
        } catch (error) {
            console.error('Error deleting summary:', error);
            let errorMessage = 'Terjadi kesalahan saat menghapus data ringkasan';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            setError(errorMessage);
        }
    };

    const handleBackToList = () => {
        setView('list');
        setCurrentSummary(null);
        setError(null);
    };

    const handleCreateSuccess = () => {
        fetchSummaries();
        setView('list');
    };

    const handleUpdateSuccess = () => {
        fetchSummaries();
        setView('list');
    };

    const handleRetry = () => {
        setError(null);
        fetchSummaries();
    };

    // Render loading state
    if (isLoading && view === 'list') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Memuat data ringkasan keuangan...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render different views
    const renderView = () => {
        switch (view) {
            case 'list':
                return (
                    <SummaryList
                        summaries={summaries}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreateNew={handleCreateNew}
                        selectedYear={selectedYear}
                        onYearChange={handleYearChange}
                        onBack={onBack}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                    />
                );
            case 'create':
                return (
                    <SummaryCreate
                        onBack={handleBackToList}
                        onSuccess={handleCreateSuccess}
                        selectedYear={selectedYear}
                    />
                );
            case 'edit':
                return (
                    <SummaryEdit
                        summary={currentSummary}
                        onBack={handleBackToList}
                        onSuccess={handleUpdateSuccess}
                    />
                );
            case 'view':
                return (
                    <SummaryView
                        summary={currentSummary}
                        onBack={handleBackToList}
                        onEdit={handleEdit}
                    />
                );
            default:
                return (
                    <SummaryList
                        summaries={summaries}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreateNew={handleCreateNew}
                        selectedYear={selectedYear}
                        onYearChange={handleYearChange}
                        onBack={onBack}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* YearManager hanya untuk list view */}
                {view === 'list' && (
                    <YearManager
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onYearChange={handleYearChange}
                        onAddYear={handleAddYear}
                        onDeleteYear={handleDeleteYear}
                        summaries={summaries}
                    />
                )}
                
                {renderView()}
            </div>
        </div>
    );
};

export default FinancialSummaries;