import React, { useState } from 'react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../data/mockData';

interface AllReceiptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onSelectReceipt: (transaction: Transaction) => void;
}

export const AllReceiptsModal: React.FC<AllReceiptsModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onSelectReceipt,
}) => {
  const [filterMethod, setFilterMethod] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const filtered = transactions.filter((t) => {
    const matchesMethod = filterMethod === 'Semua' || t.paymentMethod === filterMethod;
    const matchesSearch =
      t.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const totalFilteredAmount = filtered.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Daftar Riwayat Struk Hari Ini ({transactions.length})
            </h3>
            <p className="text-xs text-slate-500">
              Total filter: {formatRupiah(totalFilteredAmount)}
            </p>
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

        {/* Filters */}
        <div className="p-3 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-1">
            {['Semua', 'QRIS', 'Tunai', 'Debit'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMethod(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterMethod === m
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari TRX / Pelanggan..."
              className="w-full pl-7 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-500"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada data struk yang cocok dengan pencarian
            </div>
          ) : (
            filtered.map((trx) => (
              <div
                key={trx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200/80 transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{trx.orderNumber}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">{trx.time} WIB</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                      {trx.orderType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <span>{trx.customerName}</span> • <span>{trx.items.length} jenis item</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                      {formatRupiah(trx.total)}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block ${
                        trx.paymentMethod === 'QRIS'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                          : trx.paymentMethod === 'Tunai'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}
                    >
                      {trx.paymentMethod}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectReceipt(trx);
                    }}
                    className="p-2 text-teal-700 hover:bg-teal-100/60 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Cetak Ulang Struk"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="hidden sm:inline">Cetak</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
