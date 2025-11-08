import { useState } from 'react';
import { Save } from 'lucide-react';
import OperationalForm from './Operational-Form';

const OperationalCreate = ({ onBack, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        business_background_id: '',
        business_location: '',
        location_description: '',
        location_type: 'owned',
        location_size: '',
        rent_cost: '',
        employees: [],
        suppliers: [],
        daily_workflow: '',
        equipment_needs: '',
        technology_stack: '',
        status: 'draft'
    });

    const [operationalHours, setOperationalHours] = useState({
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: false }
    });

    const [currentStep, setCurrentStep] = useState(1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOperationalHoursChange = (day, field, value) => {
        setOperationalHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user || !user.id) {
                throw new Error('User data not found');
            }

            const submitData = {
                ...formData,
                operational_hours: operationalHours,
                user_id: user.id
            };

            const response = await fetch('http://localhost:8000/api/operational-plans', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Rencana operasional berhasil dibuat!');
                onSuccess();
            } else {
                throw new Error(data.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error creating operational plan:', error);
            alert('Terjadi kesalahan saat membuat rencana operasional: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OperationalForm
            title="Buat Rencana Operasional Baru"
            subtitle="Isi formulir untuk membuat rencana operasional baru"
            formData={formData}
            operationalHours={operationalHours}
            currentStep={currentStep}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onOperationalHoursChange={handleOperationalHoursChange}
            onStepChange={setCurrentStep}
            onSubmit={handleSubmit}
            onBack={onBack}
            submitButtonText="Simpan Rencana"
            submitButtonIcon={<Save size={16} />}
            mode="create"
        />
    );
};

export default OperationalCreate;