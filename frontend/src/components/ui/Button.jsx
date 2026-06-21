/**
 * Button Component
 * @param {string} label - Button text
 * @param {function} onClick - Click handler
 * @param {string} type - button | submit
 */

export default function Button({ label, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
    >
      {label}
    </button>
  );
}
