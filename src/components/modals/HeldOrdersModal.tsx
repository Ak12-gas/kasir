import React from 'react';
import { HeldOrder } from '../../types';
import { formatRupiah } from '../../data/mockData';

interface HeldOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  heldOrders: HeldOrder[];
  onResumeOrder: (order: HeldOrder) => void;
  onDeleteHeldOrder: (id: string) => void;
}

export const HeldOrdersModal: React.FC<HeldOrdersModalProps> = ({
  isOpen,
  onClose,
  heldOrders,
  onResumeOrder,
  onDeleteHeldOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Daftar Pesanan Tertahan (Parked)</h3>
            <p className="text-xs text-slate-500">{heldOrders.length} pesanan sedang ditahan</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {heldOrders.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Tidak ada pesanan yang sedang ditahan
            </div>
          ) : (
            heldOrders.map((order) => {
              const subtotal = order.items.reduce(
                (sum, i) => sum + i.product.price * i.quantity,
                0
              );
              const total = Math.round(subtotal * 1.1) - (order.discount || 0);

              return (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                          {order.orderType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{order.customerName}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatRupiah(total)}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/70 text-xs">
                    <span className="text-slate-400 text-[10px] tabular-nums">
                      Ditahan pukul {order.time}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onDeleteHeldOrder(order.id)}
                        className="text-rose-600 hover:text-rose-700 font-medium text-xs px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => onResumeOrder(order)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-3 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                      >
                        Buka Kembali
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
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
