import React, { useEffect, useState } from "react";
import userApi from "../../services/userApi";

export default function UserProfileView({ onEdit }) {
  const userLS = JSON.parse(localStorage.getItem("user"));
  const userId = userLS?.id;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await userApi.getById(userId);
      const u = res.data.data;

      setUser(u);

      setPreviewPhoto(
        u.profile_photo
          ? `${import.meta.env.VITE_STORAGE_URL}/${u.profile_photo}`
          : "/default-avatar.png"
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="text-center py-5">Memuat...</p>;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Profil Pengguna
      </h2>

      {/* Bagian Header Profil */}
      <div className="flex items-center gap-5 mb-6">
        {/* Foto */}
        <img
          src={
            previewPhoto ||
            "https://avatars.githubusercontent.com/u/79078698?s=130&v=4"
          }
          alt="Profile"
          onError={(e) => {
            e.target.src =
              "https://avatars.githubusercontent.com/u/79078698?s=130&v=4";
          }}
          className="w-28 h-28 rounded-full object-cover shadow border"
        />

        {/* Info Singkat */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>

          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            <span className="font-semibold ">WhatsApp: </span>
            {user.phone}
          </p>

          <p className="mt-1 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              Status Akun:{" "}
            </span>
            <span
              className={`${
                user.account_status === "active"
                  ? "text-green-600"
                  : user.account_status === "inactive"
                  ? "text-yellow-600"
                  : "text-red-600"
              } font-semibold`}
            >
              {user.account_status}
            </span>
          </p>
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div className="border-t pt-5 space-y-3 border-gray-600">
        <InfoItem label="Nama Lengkap" value={user.name} />
        <InfoItem label="Username" value={user.username} />
        <InfoItem label="No WhatsApp" value={user.phone} />
        <InfoItem label="Email" value={user.email ?? "-"} />
        <InfoItem
          label="Verifikasi No HP"
          value={user.phone_verified ? "✔ Terverifikasi" : "Belum"}
        />
        <InfoItem
          label="Dibuat Pada"
          value={new Date(user.created_at).toLocaleString()}
        />
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onEdit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-semibold"
        >
          Edit Profil
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-300 text-sm">{label}</span>
      <span className="font-semibold text-gray-800 dark:text-white">
        {value}
      </span>
    </div>
  );
}
