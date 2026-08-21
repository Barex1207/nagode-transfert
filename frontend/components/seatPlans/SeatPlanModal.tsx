import React from 'react';
import { X, Info } from 'lucide-react';
import YutongC9 from './YutongC9';
import YutongD7 from './YutongD7';
import YutongC12ProStandard from './YutongC12ProStandard';
import YutongC12ProStandardLED from './YutongC12ProStandardLED';
import YutongC12ProPrestige from './YutongC12ProPrestige';
import YutongV6 from './YutongV6';

export type SeatPlanKey =
  | 'yutong_c9'
  | 'yutong_d7'
  | 'yutong_c12pro_standard'
  | 'yutong_c12pro_standard_led'
  | 'yutong_c12pro_prestige'
  | 'yutong_v6';

const PLAN_COMPONENT: Record<SeatPlanKey, React.FC> = {
  yutong_c9: YutongC9,
  yutong_d7: YutongD7,
  yutong_c12pro_standard: YutongC12ProStandard,
  yutong_c12pro_standard_led: YutongC12ProStandardLED,
  yutong_c12pro_prestige: YutongC12ProPrestige,
  yutong_v6: YutongV6,
};

const PLAN_TITLE: Record<SeatPlanKey, string> = {
  yutong_c9: 'Yutong C9',
  yutong_d7: 'Yutong D7',
  yutong_c12pro_standard: 'Yutong C12 Pro Standard — châssis ZK6120D1',
  yutong_c12pro_standard_led: 'Yutong C12 Pro Standard — châssis ZK6129D (éclairage LED)',
  yutong_c12pro_prestige: 'Yutong C12 Pro — configuration Prestige',
  yutong_v6: 'Yutong V6',
};

interface SeatPlanModalProps {
  seatPlanKey: SeatPlanKey | null;
  imageUrl?: string | null;
  vehicleName: string;
  onClose: () => void;
}

const SeatPlanModal: React.FC<SeatPlanModalProps> = ({ seatPlanKey, imageUrl, vehicleName, onClose }) => {
  const Plan = seatPlanKey ? PLAN_COMPONENT[seatPlanKey] : null;
  const title = imageUrl ? vehicleName : seatPlanKey ? PLAN_TITLE[seatPlanKey] : vehicleName;

  return (
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
            <h3 className="text-lg font-black text-gray-900">{title}</h3>
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
          {imageUrl ? <img src={imageUrl} alt={`Plan des sièges — ${vehicleName}`} className="w-full h-auto rounded-xl" /> : Plan && <Plan />}
        </div>

        {!imageUrl && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
            <Info size={15} className="mt-0.5 shrink-0" />
            Représentation reconstituée à partir des croquis et informations réelles fournis par Nagode Transfert
            (nombre de places, portes, poste de conduite), complétée de façon cohérente là où un détail précis
            n'était pas lisible. Elle ne constitue pas le plan de cabine officiel du constructeur et peut différer
            légèrement de la configuration exacte de chaque véhicule.
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatPlanModal;
