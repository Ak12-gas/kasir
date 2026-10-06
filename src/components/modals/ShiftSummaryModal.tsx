import React from 'react';
import { ShiftInfo, Transaction } from '../../types';
import { formatRupiah } from '../../data/mockData';

interface ShiftSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftInfo: ShiftInfo;
  transactions: Transaction[];
}

export const ShiftSummaryModal: React.FC<ShiftSummaryModalProps> = ({
  isOpen,
  onClose,
  shiftInfo,
  transactions,
}) => {
  if (!isOpen) return null;

  // Compute breakdown from transactions if available
  const cashSales = transactions
    .filter((t) => t.paymentMethod === 'Tunai')
    .reduce((sum, t) => sum + t.total, 0) || 1350000;

  const qrisSales = transactions
    .filter((t) => t.paymentMethod === 'QRIS')
    .reduce((sum, t) => sum + t.total, 0) || 2150000;

  const debitSales = transactions
    .filter((t) => t.paymentMethod === 'Debit')
    .reduce((sum, t) => sum + t.total, 0) || 750000;

  const totalCalculated = cashSales + qrisSales + debitSales;
  const currentTotalSales = Math.max(shiftInfo.totalSales, totalCalculated);

  const totalTax = Math.round(currentTotalSales * 0.1 / 1.1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Ringkasan Shift Lengkap</h3>
              <p className="text-xs text-slate-500">
                {shiftInfo.outletName} • {shiftInfo.shiftNumber} ({shiftInfo.shiftHours})
              </p>
            </div>
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <span className="text-[11px] font-medium text-teal-700 block">Total Omzet Penjualan</span>
              <span className="text-lg font-extrabold text-teal-950 tabular-nums">
                {formatRupiah(currentTotalSales)}
              </span>
              <span className="text-[10px] text-teal-600 block mt-0.5">
                {shiftInfo.totalTransactions} Transaksi Selesai
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-medium text-emerald-700 block">Kas di Laci (Fisik)</span>
              <span className="text-lg font-extrabold text-emerald-950 tabular-nums">
                {formatRupiah(shiftInfo.cashDrawer)}
              </span>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Status: {shiftInfo.status}
              </span>
            </div>
          </div>

          {/* Rincian Metode Pembayaran */}
          <div className="border border-slate-200/80 rounded-xl p-3.5 space-y-2 bg-slate-50/30">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Rincian Metode Pembayaran
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  QRIS (GoPay, OVO, ShopeePay, BCA)
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatRupiah(qrisSales)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Uang Tunai (Cash)
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatRupiah(cashSales)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Kartu Debit / EDC
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatRupiah(debitSales)}
                </span>
              </div>
            </div>
          </div>

          {/* Rekonsiliasi Kas */}
          <div className="border border-slate-200/80 rounded-xl p-3.5 space-y-2 bg-slate-50/30">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Rekonsiliasi Kas Laci (Cash Float)
            </h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Modal Awal Kasir:</span>
                <span className="font-semibold tabular-nums">{formatRupiah(shiftInfo.startingCash)}</span>
              </div>
              <div className="flex justify-between">
                <span>Penerimaan Tunai Shift Ini:</span>
                <span className="font-semibold tabular-nums">+{formatRupiah(shiftInfo.cashDrawer - shiftInfo.startingCash)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200 font-bold text-slate-900">
                <span>Total Kas Fisik Seharusnya:</span>
                <span className="tabular-nums">{formatRupiah(shiftInfo.cashDrawer)}</span>
              </div>
            </div>
          </div>

          {/* Detail Tambahan */}
          <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-100 text-slate-600">
            <span>Pajak Restoran PB1 (10%):</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(totalTax)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
