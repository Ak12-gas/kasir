import React, { useState } from 'react';
import { ShiftInfo } from '../../types';
import { formatRupiah } from '../../data/mockData';

interface EndShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftInfo: ShiftInfo;
  onConfirmEndShift: (data: { actualCash: number; difference: number; notes: string }) => void;
}

export const EndShiftModal: React.FC<EndShiftModalProps> = ({
  isOpen,
  onClose,
  shiftInfo,
  onConfirmEndShift,
}) => {
  const [actualCashInput, setActualCashInput] = useState<string>(shiftInfo.cashDrawer.toString());
  const [notes, setNotes] = useState<string>('Semua transaksi beres, kas laci seimbang.');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const actualCash = Number(actualCashInput.replace(/\D/g, '')) || 0;
  const difference = actualCash - shiftInfo.cashDrawer;

  const handleEndShift = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirmEndShift({
        actualCash,
        difference,
        notes,
      });
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-rose-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <h3 className="font-bold text-sm text-slate-900">Tutup Kasir / Akhiri Shift</h3>
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

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-900 text-base">Shift Berhasil Ditutup</h4>
            <p className="text-xs text-slate-500">
              Laporan penutupan kasir telah disimpan dan siap diserahterimakan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEndShift} className="p-5 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Kasir Aktif:</span>
                <span className="font-bold text-slate-800">{shiftInfo.cashierName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shift & Jam:</span>
                <span className="font-medium text-slate-800">
                  {shiftInfo.shiftNumber} ({shiftInfo.shiftHours})
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Penjualan:</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {formatRupiah(shiftInfo.totalSales)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Kas Sistem (Expected):</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatRupiah(shiftInfo.cashDrawer)}
                </span>
              </div>
            </div>

            {/* Input Fisik Uang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hitungan Fisik Uang di Laci (Actual Cash)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="text"
                  value={actualCashInput ? Number(actualCashInput).toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setActualCashInput(raw);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none tabular-nums"
                  placeholder="0"
                />
              </div>

              {/* Status Selisih */}
              <div className="mt-2 flex items-center justify-between text-xs px-2">
                <span className="text-slate-500">Selisih Kas:</span>
                <span
                  className={`font-bold tabular-nums ${
                    difference === 0
                      ? 'text-emerald-600'
                      : difference > 0
                      ? 'text-blue-600'
                      : 'text-rose-600'
                  }`}
                >
                  {difference === 0
                    ? 'Rp 0 (Seimbang)'
                    : difference > 0
                    ? `+${formatRupiah(difference)} (Lebih)`
                    : `${formatRupiah(difference)} (Kurang)`}
                </span>
              </div>
            </div>

            {/* Catatan Serah Terima */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Serah Terima Kasir
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                placeholder="Tulis catatan jika ada..."
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Konfirmasi Tutup Shift</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
