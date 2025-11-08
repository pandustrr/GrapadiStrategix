import { useState, useEffect } from 'react';
import { 
    Plus, 
    Trash2, 
    MapPin, 
    Users, 
    Clock, 
    Truck, 
    Workflow,
    Building,
    Calendar,
    CheckCircle,
    Edit3,
    Save
} from 'lucide-react';

const OperationalForm = ({
    title,
    subtitle,
    formData,
    operationalHours,
    currentStep,
    isLoading,
    onInputChange,
    onOperationalHoursChange,
    onStepChange,
    onSubmit,
    onBack,
    submitButtonText,
    submitButtonIcon,
    mode = 'create'
}) => {
    const [businessBackgrounds, setBusinessBackgrounds] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ role: '', count: '', salary: '' });
    const [newSupplier, setNewSupplier] = useState({ name: '', product: '', contact: '' });

    const steps = [
        { id: 1, name: 'Lokasi Usaha', icon: MapPin },
        { id: 2, name: 'Karyawan', icon: Users },
        { id: 3, name: 'Jam Operasional', icon: Clock },
        { id: 4, name: 'Supplier', icon: Truck },
        { id: 5, name: 'Alur Kerja', icon: Workflow }
    ];

    useEffect(() => {
        fetchBusinessBackgrounds();
    }, []);

    const fetchBusinessBackgrounds = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/business', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setBusinessBackgrounds(data.data);
                if (data.data.length > 0 && !formData.business_background_id) {
                    onInputChange({ target: { name: 'business_background_id', value: data.data[0].id } });
                }
            }
        } catch (error) {
            console.error('Error fetching business backgrounds:', error);
        }
    };

    const addEmployee = () => {
        if (newEmployee.role && newEmployee.count) {
            const updatedEmployees = [...formData.employees, { ...newEmployee, id: Date.now() }];
            onInputChange({ target: { name: 'employees', value: updatedEmployees } });
            setNewEmployee({ role: '', count: '', salary: '' });
        }
    };

    const removeEmployee = (index) => {
        const updatedEmployees = formData.employees.filter((_, i) => i !== index);
        onInputChange({ target: { name: 'employees', value: updatedEmployees } });
    };

    const addSupplier = () => {
        if (newSupplier.name && newSupplier.product) {
            const updatedSuppliers = [...formData.suppliers, { ...newSupplier, id: Date.now() }];
            onInputChange({ target: { name: 'suppliers', value: updatedSuppliers } });
            setNewSupplier({ name: '', product: '', contact: '' });
        }
    };

    const removeSupplier = (index) => {
        const updatedSuppliers = formData.suppliers.filter((_, i) => i !== index);
        onInputChange({ target: { name: 'suppliers', value: updatedSuppliers } });
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            onStepChange(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            onStepChange(currentStep - 1);
        }
    };

    const StepIcon = ({ step, current }) => {
        const Icon = step.icon;
        return (
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                current >= step.id 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-300'
            }`}>
                <Icon size={16} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <StepIcon step={step} current={currentStep} />
                                <span className={`text-xs mt-2 ${
                                    currentStep >= step.id 
                                        ? 'text-green-600 font-medium' 
                                        : 'text-gray-400'
                                }`}>
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${
                                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={onSubmit}>
                    {/* Step 1: Lokasi Usaha */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Building className="text-green-600" size={24} />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Lokasi Usaha
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Pilih Bisnis
                                    </label>
                                    <select
                                        name="business_background_id"
                                        value={formData.business_background_id}
                                        onChange={onInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Bisnis</option>
                                        {businessBackgrounds.map(bg => (
                                            <option key={bg.id} value={bg.id}>
                                                {bg.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipe Lokasi
                                    </label>
                                    <select
                                        name="location_type"
                                        value={formData.location_type}
                                        onChange={onInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="owned">Milik Sendiri</option>
                                        <option value="rented">Sewa</option>
                                        <option value="leased">Sewa Jangka Panjang</option>
                                        <option value="virtual">Virtual/Online</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alamat Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="business_location"
                                    value={formData.business_location}
                                    onChange={onInputChange}
                                    placeholder="Jl. Contoh No. 123, Jakarta"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Deskripsi Lokasi
                                </label>
                                <textarea
                                    name="location_description"
                                    value={formData.location_description}
                                    onChange={onInputChange}
                                    rows={3}
                                    placeholder="Deskripsi detail tentang lokasi usaha, akses, fasilitas, dll."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Luas Lokasi (m²)
                                    </label>
                                    <input
                                        type="number"
                                        name="location_size"
                                        value={formData.location_size}
                                        onChange={onInputChange}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Biaya Sewa per Bulan (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        name="rent_cost"
                                        value={formData.rent_cost}
                                        onChange={onInputChange}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Karyawan */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Users className="text-green-600" size={24} />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Struktur Karyawan
                                </h2>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Tambah Posisi Karyawan
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Posisi/Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            value={newEmployee.role}
                                            onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                                            placeholder="Manager, Staff, dll."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Jumlah
                                        </label>
                                        <input
                                            type="number"
                                            value={newEmployee.count}
                                            onChange={(e) => setNewEmployee(prev => ({ ...prev, count: e.target.value }))}
                                            placeholder="1"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gaji per Bulan (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            value={newEmployee.salary}
                                            onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={addEmployee}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Tambah Posisi
                                </button>
                            </div>

                            {/* Employee List */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Daftar Karyawan
                                </h3>
                                
                                {formData.employees.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Belum ada data karyawan</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.employees.map((employee, index) => (
                                            <div key={employee.id || index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {employee.role}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {employee.count} orang • Rp {employee.salary ? parseInt(employee.salary).toLocaleString('id-ID') : '0'} per bulan
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmployee(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Jam Operasional */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-green-600" size={24} />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Jam Operasional
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(operationalHours).map(([day, hours]) => (
                                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <span className="w-24 font-medium text-gray-900 dark:text-white capitalize">
                                                {day === 'monday' ? 'Senin' :
                                                 day === 'tuesday' ? 'Selasa' :
                                                 day === 'wednesday' ? 'Rabu' :
                                                 day === 'thursday' ? 'Kamis' :
                                                 day === 'friday' ? 'Jumat' :
                                                 day === 'saturday' ? 'Sabtu' : 'Minggu'}
                                            </span>
                                            
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={hours.closed}
                                                    onChange={(e) => onOperationalHoursChange(day, 'closed', e.target.checked)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Tutup</span>
                                            </label>
                                        </div>
                                        
                                        {!hours.closed && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={hours.open}
                                                    onChange={(e) => onOperationalHoursChange(day, 'open', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                />
                                                <span className="text-gray-500">sampai</span>
                                                <input
                                                    type="time"
                                                    value={hours.close}
                                                    onChange={(e) => onOperationalHoursChange(day, 'close', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Supplier */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Truck className="text-green-600" size={24} />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Supplier & Mitra Bisnis
                                </h2>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Tambah Supplier
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nama Supplier
                                        </label>
                                        <input
                                            type="text"
                                            value={newSupplier.name}
                                            onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="PT. Contoh Supplier"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Produk/Layanan
                                        </label>
                                        <input
                                            type="text"
                                            value={newSupplier.product}
                                            onChange={(e) => setNewSupplier(prev => ({ ...prev, product: e.target.value }))}
                                            placeholder="Bahan baku, jasa, dll."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Kontak
                                        </label>
                                        <input
                                            type="text"
                                            value={newSupplier.contact}
                                            onChange={(e) => setNewSupplier(prev => ({ ...prev, contact: e.target.value }))}
                                            placeholder="email/telepon"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={addSupplier}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Tambah Supplier
                                </button>
                            </div>

                            {/* Supplier List */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Daftar Supplier
                                </h3>
                                
                                {formData.suppliers.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <Truck size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Belum ada data supplier</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.suppliers.map((supplier, index) => (
                                            <div key={supplier.id || index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {supplier.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {supplier.product} • {supplier.contact}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSupplier(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Alur Kerja */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Workflow className="text-green-600" size={24} />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Alur Kerja & Kebutuhan
                                </h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alur Kerja Harian
                                </label>
                                <textarea
                                    name="daily_workflow"
                                    value={formData.daily_workflow}
                                    onChange={onInputChange}
                                    rows={6}
                                    placeholder="Deskripsikan alur kerja harian dari buka sampai tutup. Contoh:
• 08:00 - Persiapan buka
• 09:00 - Mulai operasional
• 12:00 - Peak hour
• 17:00 - Persiapan tutup
• 18:00 - Tutup dan cleaning"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kebutuhan Peralatan
                                </label>
                                <textarea
                                    name="equipment_needs"
                                    value={formData.equipment_needs}
                                    onChange={onInputChange}
                                    rows={4}
                                    placeholder="Daftar peralatan yang dibutuhkan untuk operasional:
• Komputer dan printer
• Mesin kasir
• Furniture
• Peralatan khusus lainnya"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Teknologi & Software
                                </label>
                                <textarea
                                    name="technology_stack"
                                    value={formData.technology_stack}
                                    onChange={onInputChange}
                                    rows={4}
                                    placeholder="Teknologi dan software yang digunakan:
• Software akuntansi
• Aplikasi POS
• Website/e-commerce
• Tools manajemen proyek"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Status Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status Rencana
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={onInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-6 py-2 rounded-lg border transition-colors ${
                                currentStep === 1
                                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            Kembali
                        </button>

                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Lanjut
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        {submitButtonIcon}
                                        {submitButtonText}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OperationalForm;