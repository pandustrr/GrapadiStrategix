export default function UserProfileField({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
      />
    </div>
  );
}
