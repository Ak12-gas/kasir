import React, { useState, useEffect } from 'react';
import { CartItem } from '../../types';

interface ItemNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CartItem | null;
  onSaveNote: (productId: string, note: string) => void;
}

const PRESET_NOTES = [
  'Panaskan Extra Crispy',
  'Giling Medium • Filter',
  'Giling Halus • Espresso',
  'Biji Utuh (Whole Bean)',
  'Less Sugar (50%)',
  'No Sugar',
  'Extra Ice',
  'Less Ice',
  'Gula Cair Pisah',
  'Bungkus Take Away',
];

export const ItemNoteModal: React.FC<ItemNoteModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveNote,
}) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (item) {
      setNote(item.note || '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(item.product.id, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Catatan Pesanan</h3>
            <p className="text-xs text-slate-500 truncate max-w-[240px]">{item.product.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan / Permintaan Khusus
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Panaskan Extra Crispy..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
              autoFocus
            />
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Pilihan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {PRESET_NOTES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNote(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    note === preset
                      ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
