import { useEffect, useState, useRef } from "react";
import userApi from "../../services/userApi";
import { toast } from "react-toastify";

export default function UserProfileEdit({ onBack }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    status: "active",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef();

  // ---------------------------------------------------------
  // Load user data
  // ---------------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    userApi
      .getById(userId)
      .then((res) => {
        const data = res.data.data;

        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
          status: data.status || "active",
        });

        if (data.profile_photo) {
          setPhotoPreview(`/storage/${data.profile_photo}`);
        } else {
          // default avatar
          setPhotoPreview(
            "https://ui-avatars.com/api/?name=Unknown&background=ccc&color=555"
          );
        }
      })
      .catch(() => toast.error("Gagal memuat data pengguna"))
      .finally(() => setLoading(false));
  }, [userId]);

  // ---------------------------------------------------------
  // Handle inputs
  // ---------------------------------------------------------

  const handleInput = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      fileInputRef.current.value = "";
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, profile_photo: file }));
  };

  // ---------------------------------------------------------
  // Save profile
  // ---------------------------------------------------------

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("username", form.username);
      fd.append("status", form.status);

      if (form.profile_photo instanceof File) {
        fd.append("profile_photo", form.profile_photo);
      }

      const res = await userApi.update(userId, fd);

      toast.success("Profil berhasil diperbarui");

      const updated = res.data.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: updated.name,
          email: updated.email,
          username: updated.username,
          profile_photo: updated.profile_photo,
        })
      );

      setUser(updated);

      // otomatis kembali ke view profile
      onBack && onBack();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Change password
  // ---------------------------------------------------------

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const current = e.target.current_password.value;
    const newp = e.target.new_password.value;
    const confirm = e.target.new_password_confirmation.value;

    if (!current || !newp) {
      toast.error("Isi semua field password");
      return;
    }
    if (newp.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    if (newp !== confirm) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        current_password: current,
        new_password: newp,
        new_password_confirmation: confirm,
      };

      const res = await userApi.updatePassword(userId, payload);
      toast.success(res.data.message || "Password berhasil diubah");

      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------
  if (loading && !user)
    return <div className="py-8 text-center">Memuat...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm"
      >
        ← Kembali
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Edit Profil
      </h2>

      {/* FORM EDIT PROFIL */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        {/* Foto Profil */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full shadow overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Foto Profil
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="text-gray-800 dark:text-gray-100"
              onChange={handleFile}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              JPG/PNG max 2MB
            </p>
          </div>
        </div>

        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nama
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleInput}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleInput}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Status Akun */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Status Akun
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleInput}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded w-full font-semibold"
        >
          Simpan Profil
        </button>
      </form>

      {/* FORM UBAH PASSWORD */}
      <hr className="my-6 border-gray-300 dark:border-gray-600" />

      <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Ubah Password
      </h3>

      <form onSubmit={handleChangePassword} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">
            Password Lama
          </label>
          <input
            name="current_password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">
            Password Baru
          </label>
          <input
            name="new_password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">
            Konfirmasi Password Baru
          </label>
          <input
            name="new_password_confirmation"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded w-full font-semibold"
        >
          Ganti Password
        </button>
      </form>
    </div>
  );
}
