'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}