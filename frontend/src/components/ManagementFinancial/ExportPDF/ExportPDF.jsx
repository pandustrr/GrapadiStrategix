import { useState, useEffect } from "react";
import { FiDownload, FiArrowLeft, FiCalendar, FiFileText, FiTrendingUp, FiAlertCircle, FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const ExportPDF = ({ onBack, selectedBusiness }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [periodType, setPeriodType] = useState("year"); // 'year' or 'month'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [availableYears, setAvailableYears] = useState([]);
  const [includeCharts, setIncludeCharts] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    generateAvailableYears();
  }, []);

  // Generate list of available years (from 2020 to current year + 1)
  const generateAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear + 1; year++) {
      years.push(year);
    }
    setAvailableYears(years.reverse()); // Latest first
  };

  // Month names in Indonesian
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const handleGeneratePDF = async () => {
    if (!selectedBusiness) {
      toast.error("Silakan pilih bisnis terlebih dahulu");
      return;
    }

    if (!user || !user.id) {
      toast.error("User tidak terautentikasi. Silakan login kembali");
      return;
    }

    setLoading(true);

    try {
      // Build period value based on type
      let periodValue;
      if (periodType === "year") {
        periodValue = selectedYear.toString();
      } else {
        // Format: YYYY-MM
        periodValue = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
      }

      // Prepare charts data (jika include charts = true)
      const charts = includeCharts
        ? {
            income_vs_expense: null, // Will be generated on backend
            monthly_trend: null,
            projection_comparison: null,
            category_income_pie: null,
            category_expense_pie: null,
          }
        : null;

      // Prepare request data
      const requestData = {
        user_id: parseInt(user.id),
        business_background_id: selectedBusiness.id,
        period_type: periodType,
        period_value: periodValue,
        charts: charts,
      };

      const response = await axios.post(`${apiUrl}/management-financial/pdf/generate`, requestData, {
        responseType: "blob", // Important for PDF download
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const businessName = selectedBusiness.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const periodLabel = periodType === "year" ? selectedYear : `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
      const timestamp = new Date().toISOString().split("T")[0];

      link.setAttribute("download", `laporan-keuangan-${businessName}-${periodLabel}-${timestamp}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Laporan PDF berhasil diunduh!");
    } catch (error) {
      console.error("Export PDF Error:", error);
      console.error("Error Response:", error.response?.data);
      console.error("Error Status:", error.response?.status);

      if (error.response?.status === 404) {
        toast.error("Data keuangan tidak ditemukan untuk periode ini");
      } else if (error.response?.status === 422) {
        // Try to parse error message from blob
        if (error.response?.data instanceof Blob) {
          const text = await error.response.data.text();
          console.error("Validation Error Detail:", text);
          try {
            const errorData = JSON.parse(text);
            const errorMessages = Object.values(errorData.errors || {})
              .flat()
              .join(", ");
            toast.error(`Validasi gagal: ${errorMessages || errorData.message}`);
          } catch (e) {
            toast.error("Parameter tidak valid. Periksa kembali pilihan Anda");
          }
        } else {
          const errorMessages = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(", ") : error.response?.data?.message;
          toast.error(`Validasi gagal: ${errorMessages || "Parameter tidak valid"}`);
        }
      } else {
        toast.error(error.response?.data?.message || "Gagal mengunduh laporan PDF. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center gap-2 mb-4 text-gray-600 transition-colors hover:text-blue-600">
            <FiArrowLeft className="text-xl" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="p-4 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
              <FiFileText className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Export PDF Laporan Keuangan</h1>
              <p className="mt-1 text-gray-600">{selectedBusiness?.name || "Pilih bisnis untuk mengunduh laporan"}</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          {!selectedBusiness ? (
            <div className="py-12 text-center">
              <FiAlertCircle className="mx-auto mb-4 text-6xl text-gray-300" />
              <p className="text-lg text-gray-500">Silakan pilih bisnis terlebih dahulu dari halaman utama</p>
            </div>
          ) : (
            <>
              {/* Info Business */}
              <div className="p-6 mb-8 bg-blue-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-3 font-semibold text-blue-900">
                  <FiTrendingUp className="text-xl" />
                  Informasi Bisnis
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nama Bisnis:</span>
                    <p className="mt-1 font-semibold text-gray-800">{selectedBusiness.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Jenis Usaha:</span>
                    <p className="mt-1 font-semibold text-gray-800">{selectedBusiness.business_type || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Modal Awal:</span>
                    <p className="mt-1 font-semibold text-green-600">Rp {selectedBusiness.initial_capital?.toLocaleString("id-ID") || "0"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="mt-1 font-semibold text-gray-800">{selectedBusiness.status || "Aktif"}</p>
                  </div>
                </div>
              </div>

              {/* Period Selection */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                  <FiCalendar className="text-xl text-blue-600" />
                  Pilih Periode Laporan
                </h3>

                {/* Period Type Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setPeriodType("year")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${periodType === "year" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Per Tahun
                  </button>
                  <button
                    onClick={() => setPeriodType("month")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${periodType === "month" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Per Bulan
                  </button>
                </div>

                {/* Year Selection */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Tahun</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Selection (if period type is month) */}
                {periodType === "month" && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Bulan</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-3 transition-all border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {monthNames.map((month, index) => (
                        <option key={index + 1} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="mb-8">
                <h3 className="mb-4 font-semibold text-gray-800">Opsi Laporan</h3>

                <label className="flex items-center gap-3 p-4 transition-colors cursor-pointer bg-gray-50 rounded-xl hover:bg-gray-100">
                  <input type="checkbox" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Sertakan Grafik & Visualisasi</p>
                    <p className="mt-1 text-sm text-gray-600">Tambahkan grafik perbandingan pendapatan vs pengeluaran dan tren bulanan</p>
                  </div>
                  {includeCharts && <FiCheck className="text-2xl text-green-600" />}
                </label>
              </div>

              {/* Preview Info */}
              <div className="p-4 mb-8 border border-yellow-200 bg-yellow-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-xl text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="mb-1 font-semibold">Yang Akan Disertakan dalam PDF:</p>
                    <ul className="ml-2 space-y-1 list-disc list-inside">
                      <li>Ringkasan Eksekutif (Pendapatan, Pengeluaran, Laba/Rugi, Posisi Kas)</li>
                      <li>Ringkasan Per Kategori (Top 5 Pendapatan & Pengeluaran)</li>
                      {periodType === "year" && <li>Tren Bulanan (12 Bulan)</li>}
                      <li>Proyeksi Keuangan 5 Tahun (3 Skenario: Optimistik, Realistik, Pesimistik)</li>
                      {includeCharts && <li>Grafik & Visualisasi Data</li>}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGeneratePDF}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Membuat PDF...</span>
                  </>
                ) : (
                  <>
                    <FiDownload className="text-xl" />
                    <span>Unduh Laporan PDF</span>
                  </>
                )}
              </button>

              {/* Period Info */}
              <div className="mt-6 text-sm text-center text-gray-500">
                Laporan akan diunduh untuk periode: <span className="font-semibold text-gray-700">{periodType === "year" ? `Tahun ${selectedYear}` : `${monthNames[selectedMonth - 1]} ${selectedYear}`}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 mt-6 bg-white shadow-md rounded-xl">
          <h4 className="mb-3 font-semibold text-gray-800">📋 Catatan Penting:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span>
                Laporan PDF akan diunduh dalam format <strong>landscape A4</strong> untuk memudahkan membaca tabel yang lebar
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span>
                Proyeksi keuangan yang ditampilkan adalah <strong>data proyeksi terbaru</strong> untuk setiap skenario
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span>Pastikan bisnis Anda sudah memiliki data transaksi untuk periode yang dipilih</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span>
                PDF akan otomatis diberi <strong>watermark SmartPlan</strong> untuk keamanan dokumen
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExportPDF;
