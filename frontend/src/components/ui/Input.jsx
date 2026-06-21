/**
 * Input Component
 * @param {string} type - input type
 * @param {string} placeholder - placeholder text
 * @param {string} value - input value
 * @param {function} onChange - change handler
 */

export default function Input({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  );
}
