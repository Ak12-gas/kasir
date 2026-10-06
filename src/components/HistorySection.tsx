import React from 'react';
import { Transaction } from '../types';
import { formatRupiah } from '../data/mockData';

interface HistorySectionProps {
  transactions: Transaction[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReprintReceipt: (transaction: Transaction) => void;
  onViewAllReceipts: () => void;
  totalTransactionsCount: number;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  transactions,
  searchQuery,
  onSearchChange,
  onReprintReceipt,
  onViewAllReceipts,
  totalTransactionsCount,
}) => {
  const getBadgeStyle = (method: string) => {
    switch (method) {
      case 'QRIS':
        return 'bg-teal-50 text-teal-700 border border-teal-200/50';
      case 'Tunai':
        return 'bg-amber-50 text-amber-700 border border-amber-200/50';
      case 'Debit':
        return 'bg-blue-50 text-blue-700 border border-blue-200/50';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200/50';
    }
  };

  return (
    <section
      id="history-section"
      className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-full"
    >
      {/* History Header */}
      <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Riwayat Struk</h2>
        </div>
        <span className="text-xs font-medium text-slate-400">Hari Ini</span>
      </div>

      {/* Receipt Search */}
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition placeholder:text-slate-400"
            placeholder="Cari No. Struk..."
            type="text"
          />
        </div>
      </div>

      {/* Receipt List */}
      <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[380px] lg:max-h-[calc(100vh-360px)] min-h-[220px]">
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <p className="text-xs font-semibold text-slate-600">Tidak ada struk ditemukan</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cari dengan nomor struk lain atau kosongkan kolom pencarian
            </p>
          </div>
        ) : (
          transactions.map((trx) => (
            <div
              key={trx.id}
              className="p-2.5 rounded-xl bg-slate-50/60 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition space-y-1"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">{trx.orderNumber}</span>
                <span className="text-slate-400 text-[11px] tabular-nums">{trx.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                  {formatRupiah(trx.total)}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getBadgeStyle(
                    trx.paymentMethod
                  )}`}
                >
                  {trx.paymentMethod}
                </span>
              </div>
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onReprintReceipt(trx)}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 active:scale-95 transition cursor-pointer"
                  title="Lihat & Cetak Ulang Struk"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Cetak Ulang</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Action */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={onViewAllReceipts}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
        >
          <span>Lihat Semua Struk ({totalTransactionsCount})</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 5l7 7m0 0l-7 7m7-7H3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};
