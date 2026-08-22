import React from 'react';
import { X } from 'lucide-react';

interface SeatPlanModalProps {
  imageUrl: string;
  vehicleName: string;
  onClose: () => void;
}

const SeatPlanModal: React.FC<SeatPlanModalProps> = ({ imageUrl, vehicleName, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label={`Plan des sièges — ${vehicleName}`}
  >
    <div
      className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[var(--brand-dark)]">Plan des sièges</p>
          <h3 className="text-lg font-black text-gray-900">{vehicleName}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-[#FAF8FC] p-4">
        <img src={imageUrl} alt={`Plan des sièges — ${vehicleName}`} className="w-full h-auto rounded-xl" />
      </div>
    </div>
  </div>
);

export default SeatPlanModal;
