/**
 * Modal Component
 * @param {boolean} isOpen - show/hide modal
 * @param {function} onClose - close handler
 * @param {ReactNode} children - modal content
 */

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
