import React from 'react';
import { formatRupiah } from '../data/mockData';
import { ShiftInfo } from '../types';

interface MetricsBarProps {
  shiftInfo: ShiftInfo;
  onOpenShiftSummary: () => void;
  onOpenEndShift: () => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  shiftInfo,
  onOpenShiftSummary,
  onOpenEndShift,
}) => {
  return (
    <section className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 items-center">
          {/* Penjualan Hari Ini */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block leading-tight truncate">
                Penjualan Hari Ini
              </span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {formatRupiah(shiftInfo.totalSales)}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                  ({shiftInfo.totalTransactions} Transaksi)
                </span>
              </div>
            </div>
          </div>

          {/* Kas di Laci */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 4h16m-9 4h2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block leading-tight truncate">
                Kas di Laci (Cash Drawer)
              </span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {formatRupiah(shiftInfo.cashDrawer)}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {shiftInfo.status}
                </span>
              </div>
            </div>
          </div>

          {/* Status Shift */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3 flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block leading-tight truncate">
                Status Shift & Kasir
              </span>
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {shiftInfo.shiftNumber}{' '}
                <span className="text-slate-400 font-normal">
                  {shiftInfo.shiftHours}
                </span>{' '}
                • <span className="text-teal-700">{shiftInfo.cashierName}</span>
              </div>
            </div>
          </div>

          {/* Action Shift Buttons */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3 flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onOpenShiftSummary}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Ringkasan Lengkap</span>
            </button>
            <button
              type="button"
              onClick={onOpenEndShift}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 text-rose-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Tutup Kasir / End Shift</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
