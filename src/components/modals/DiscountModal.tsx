import React, { useState } from 'react';
import { formatRupiah } from '../../data/mockData';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  currentDiscount: number;
  onApplyDiscount: (amount: number) => void;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  currentDiscount,
  onApplyDiscount,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [customDiscount, setCustomDiscount] = useState(currentDiscount ? currentDiscount.toString() : '');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    setErrorMsg('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'DISKON10' || code === 'HEMAT10') {
      const disc = Math.round(subtotal * 0.1);
      onApplyDiscount(disc);
      onClose();
    } else if (code === 'MEMBER' || code === 'VIP') {
      const disc = Math.round(subtotal * 0.15);
      onApplyDiscount(disc);
      onClose();
    } else if (code === 'HEMAT20RB') {
      const disc = Math.min(subtotal, 20000);
      onApplyDiscount(disc);
      onClose();
    } else {
      setErrorMsg('Kode promo tidak valid atau telah kedaluwarsa.');
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(customDiscount.replace(/\D/g, '')) || 0;
    if (amount > subtotal) {
      setErrorMsg('Diskon tidak boleh melebihi subtotal.');
      return;
    }
    onApplyDiscount(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Diskon & Promo</h3>
            <p className="text-xs text-slate-500">Subtotal: {formatRupiah(subtotal)}</p>
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
        <div className="p-4 space-y-4">
          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Preset Promos */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-1.5">
              Voucher / Kupon Tersedia:
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onApplyDiscount(Math.round(subtotal * 0.1));
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-teal-900">DISKON10 (10% Off)</span>
                  <p className="text-[10px] text-teal-700">Potongan 10% untuk semua menu</p>
                </div>
                <span className="text-xs font-bold text-teal-800 tabular-nums">
                  -{formatRupiah(Math.round(subtotal * 0.1))}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onApplyDiscount(20000);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-teal-200 bg-slate-50 hover:bg-teal-50/30 flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-slate-900">HEMAT20RB (Potongan Rp 20.000)</span>
                  <p className="text-[10px] text-slate-500">Min. belanja Rp 50.000</p>
                </div>
                <span className="text-xs font-bold text-slate-700 tabular-nums">
                  -Rp 20.000
                </span>
              </button>
            </div>
          </div>

          {/* Promo code input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Punya Kode Promo Lain?
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Contoh: VIP / MEMBER"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase outline-none focus:bg-white focus:border-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </div>

          {/* Custom Nominal Discount */}
          <form onSubmit={handleApplyCustom} className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Atau Masukkan Nominal Diskon Manual (Rp)
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customDiscount ? Number(customDiscount.replace(/\D/g, '')).toLocaleString('id-ID') : ''}
                onChange={(e) => setCustomDiscount(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 tabular-nums"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>

          {currentDiscount > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onApplyDiscount(0);
                  onClose();
                }}
                className="w-full py-1.5 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                Hapus Diskon Saat Ini
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
