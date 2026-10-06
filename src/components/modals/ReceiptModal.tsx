import React from 'react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../data/mockData';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-xs text-slate-800">
              Struk Pembayaran: {transaction.orderNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-100/50">
          <div
            id="printable-receipt"
            className="bg-white p-5 rounded-xl shadow-xs border border-dashed border-slate-300 font-mono text-[11px] text-slate-800 leading-tight space-y-3"
          >
            {/* Store Banner */}
            <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300">
              <div className="font-black text-sm tracking-wider uppercase text-slate-900">
                ApexSME Coffee & Roastery
              </div>
              <div className="text-[10px] text-slate-500">
                {transaction.outletName || 'Central Jakarta Flagship'}
              </div>
              <div className="text-[9px] text-slate-400">
                Jl. Kebon Sirih No. 42, Jakarta Pusat
              </div>
              <div className="text-[9px] text-slate-400">
                Telp: (021) 392-1088 • NPWPD: 01.382.912.4-021
              </div>
            </div>

            {/* Transaction Metadata */}
            <div className="space-y-0.5 text-[10px] text-slate-600 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>No. Struk:</span>
                <span className="font-bold text-slate-900">{transaction.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{transaction.time || '14:30'} WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir / Reg:</span>
                <span>{transaction.cashierName} ({transaction.registerId || 'Reg #01'})</span>
              </div>
              <div className="flex justify-between">
                <span>Tipe Order:</span>
                <span className="font-semibold text-slate-900">{transaction.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{transaction.customerName}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 py-1 pb-2 border-b border-dashed border-slate-300">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start font-semibold text-slate-900">
                    <span className="truncate pr-2">{item.product.name}</span>
                    <span className="tabular-nums">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>
                      {item.quantity} x {formatRupiah(item.product.price)}
                    </span>
                    {item.note && <span className="italic truncate max-w-[140px]">({item.note})</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1 text-[10px] pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({transaction.items.length} item):</span>
                <span className="tabular-nums">{formatRupiah(transaction.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>PB1 Restoran (10%):</span>
                <span className="tabular-nums">{formatRupiah(transaction.tax)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Promo:</span>
                  <span className="tabular-nums">-{formatRupiah(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-1 text-xs font-black text-slate-950">
                <span>TOTAL:</span>
                <span className="text-sm tabular-nums">{formatRupiah(transaction.total)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-0.5 text-[10px] text-slate-600 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>Metode Bayar:</span>
                <span className="font-bold text-slate-900">{transaction.paymentMethod}</span>
              </div>
              {transaction.paymentMethod === 'Tunai' && (
                <>
                  <div className="flex justify-between">
                    <span>Tunai Diterima:</span>
                    <span className="tabular-nums">
                      {formatRupiah(transaction.amountPaid || transaction.total)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Kembalian:</span>
                    <span className="tabular-nums">
                      {formatRupiah(transaction.change || 0)}
                    </span>
                  </div>
                </>
              )}
              {transaction.paymentMethod === 'QRIS' && (
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Ref No:</span>
                  <span>QRIS-{transaction.orderNumber.replace('#', '')}-OK</span>
                </div>
              )}
            </div>

            {/* Thank You Note */}
            <div className="text-center space-y-1 pt-1 text-[9px] text-slate-400">
              <p>Terima kasih atas kunjungan Anda!</p>
              <p>Wi-Fi: ApexSME_Guest | Sandi: ngopidulu</p>
              <p className="tracking-widest">*** SIMPAN STRUK INI ***</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
