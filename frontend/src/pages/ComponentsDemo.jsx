import { useState } from "react";
import { Button, Input, Modal, Toast, Loader } from "../components/ui";

export default function ComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          UI Components Demo
        </h1>

        {/* Input Section */}
        <div className="p-6 border rounded-2xl shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-700">Input</h2>
          <Input placeholder="Type something..." />
        </div>

        {/* Buttons Section */}
        <div className="p-6 border rounded-2xl shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-700">Actions</h2>

          <div className="flex gap-4 flex-wrap">
            <Button label="Show Modal" onClick={() => setModalOpen(true)} />

            <Button
              label="Show Toast"
              onClick={() => {
                setToast("Success!");
                setTimeout(() => setToast(""), 3000);
              }}
            />
          </div>
        </div>

        {/* Loader Section */}
        <div className="p-6 border rounded-2xl shadow-sm flex flex-col gap-4 items-center">
          <h2 className="text-lg font-semibold text-gray-700">Loader</h2>
          <Loader />
        </div>

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <p className="text-gray-700">This is a modal</p>
        </Modal>

        {/* Toast */}
        {toast && <Toast message={toast} />}
      </div>
    </div>
  );
}
