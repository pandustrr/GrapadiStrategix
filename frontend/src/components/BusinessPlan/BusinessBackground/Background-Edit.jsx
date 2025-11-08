import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import BackgroundForm from './Background-Form';
import { backgroundApi } from '../../../services/businessPlan';
import { toast } from 'react-toastify';

const BackgroundEdit = ({ business, onBack, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        purpose: '',
        location: '',
        business_type: '',
        start_date: '',
        values: '',
        vision: '',
        mission: '',
        contact: '',
        logo: undefined // Gunakan undefined bukan null
    });

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                category: business.category || '',
                description: business.description || '',
                purpose: business.purpose || '',
                location: business.location || '',
                business_type: business.business_type || '',
                start_date: business.start_date || '',
                values: business.values || '',
                vision: business.vision || '',
                mission: business.mission || '',
                contact: business.contact || '',
                logo: undefined // Tetap undefined
            });
            
            if (business.logo) {
                setLogoPreview(`http://localhost:8000/storage/${business.logo}`);
                setCurrentLogo(business.logo);
            }
        }
    }, [business]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }
            
            setFormData(prev => ({ ...prev, logo: file }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setFormData(prev => ({ ...prev, logo: null }));
        setLogoPreview(null);
        setCurrentLogo(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user || !user.id) {
                throw new Error('User data not found');
            }

            // Siapkan data untuk update
            const submitData = {
                ...formData,
                user_id: user.id,
                // Jika logo undefined, jangan kirim field logo sama sekali
                // Jika logo null, kirim null (hapus logo)
                // Jika logo File, kirim file
            };

            // Hapus field logo jika undefined (biarkan logo tetap)
            if (submitData.logo === undefined) {
                delete submitData.logo;
            }

            console.log('Updating business data:', submitData);

            const response = await backgroundApi.update(business.id, submitData);

            if (response.data.status === 'success') {
                toast.success('Data bisnis berhasil diperbarui!');
                onSuccess();
            } else {
                throw new Error(response.data.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error updating business:', error);
            
            let errorMessage = 'Terjadi kesalahan saat memperbarui data bisnis';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                errorMessage = errors.join(', ');
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!business) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <BackgroundForm
            title="Edit Data Bisnis"
            subtitle="Perbarui informasi bisnis"
            formData={formData}
            logoPreview={logoPreview || (currentLogo ? `http://localhost:8000/storage/${currentLogo}` : null)}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onRemoveLogo={removeLogo}
            onSubmit={handleSubmit}
            onBack={onBack}
            submitButtonText="Perbarui Bisnis"
            submitButtonIcon={<Save size={16} />}
            mode="edit"
        />
    );
};

export default BackgroundEdit;