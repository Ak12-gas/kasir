import React, { useState } from 'react';
import { CartItem, OrderType, PaymentMethod } from '../types';
import { formatRupiah } from '../data/mockData';

interface CartSectionProps {
  currentOrderNumber: string;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  customerName: string;
  onChangeCustomerName: (name: string) => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenItemNote: (item: CartItem) => void;
  onHoldOrder: () => void;
  heldOrdersCount: number;
  onViewHeldOrders: () => void;
  onClearCart: () => void;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  discount: number;
  onApplyDiscount: () => void;
  onCheckout: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  currentOrderNumber,
  orderType,
  onChangeOrderType,
  customerName,
  onChangeCustomerName,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenItemNote,
  onHoldOrder,
  heldOrdersCount,
  onViewHeldOrders,
  onClearCart,
  paymentMethod,
  onSelectPaymentMethod,
  discount,
  onApplyDiscount,
  onCheckout,
}) => {
  const [isOrderTypeDropdownOpen, setIsOrderTypeDropdownOpen] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [tempCustomerName, setTempCustomerName] = useState(customerName);

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // PB1 10%
  const tax = Math.round(subtotal * 0.1);
  const total = Math.max(0, subtotal + tax - discount);
  const itemCount = cart.length;

  return (
    <section
      id="cart-section"
      className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-full"
    >
      {/* Order Header */}
      <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentOrderNumber}
            </h2>

            {/* Order Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOrderTypeDropdownOpen(!isOrderTypeDropdownOpen)}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition cursor-pointer"
              >
                <span>{orderType}</span>
                <svg
                  className="w-2.5 h-2.5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>

              {isOrderTypeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOrderTypeDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
                    {(['Dine In', 'Take Away', 'Delivery'] as OrderType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          onChangeOrderType(type);
                          setIsOrderTypeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition cursor-pointer ${
                          orderType === type ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Editable Customer Name */}
          {isEditingCustomer ? (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="text"
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onChangeCustomerName(tempCustomerName.trim() || 'Pelanggan Umum');
                    setIsEditingCustomer(false);
                  }
                }}
                className="text-xs px-1.5 py-0.5 border border-teal-500 rounded outline-none w-36"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  onChangeCustomerName(tempCustomerName.trim() || 'Pelanggan Umum');
                  setIsEditingCustomer(false);
                }}
                className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded cursor-pointer"
              >
                OK
              </button>
            </div>
          ) : (
            <p
              onClick={() => {
                setTempCustomerName(customerName);
                setIsEditingCustomer(true);
              }}
              className="text-xs text-slate-400 mt-0.5 hover:text-slate-600 cursor-pointer flex items-center gap-1 group"
              title="Klik untuk ubah nama pelanggan"
            >
              <span>{customerName}</span>
              <svg
                className="w-3 h-3 text-slate-300 group-hover:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </p>
          )}
        </div>

        {/* Action buttons (Tahan & Trash) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onHoldOrder}
            disabled={cart.length === 0}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition cursor-pointer"
            title="Tahan pesanan saat ini untuk pelanggan lain"
          >
            Tahan
          </button>

          {heldOrdersCount > 0 && (
            <button
              type="button"
              onClick={onViewHeldOrders}
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
              title="Buka pesanan tertahan"
            >
              {heldOrdersCount} Tertahan
            </button>
          )}

          <button
            type="button"
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Kosongkan Pesanan"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Items in Cart */}
      <div className="p-3 sm:p-4 flex-1 space-y-3 overflow-y-auto max-h-[300px] lg:max-h-[360px] min-h-[200px]">
        {cart.length === 0 ? (
          <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-4 text-slate-400">
            <svg
              className="w-10 h-10 stroke-1 mb-2 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <p className="text-xs font-semibold text-slate-600">Keranjang masih kosong</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Klik menu di sebelah kiri untuk menambahkan pesanan
            </p>
          </div>
        ) : (
          cart.map((item, index) => {
            const itemTotal = item.product.price * item.quantity;
            const isLast = index === cart.length - 1;

            return (
              <div
                key={item.product.id}
                className={`space-y-1.5 ${isLast ? 'pb-2' : 'pb-3 border-b border-slate-100'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="pr-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                      {item.product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onOpenItemNote(item)}
                      className="text-[11px] text-slate-400 hover:text-teal-600 transition flex items-center gap-1 mt-0.5 text-left cursor-pointer"
                      title="Klik untuk ubah catatan"
                    >
                      <span>{item.note || 'Tambah catatan...'}</span>
                      <svg
                        className="w-2.5 h-2.5 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatRupiah(itemTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-lg p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-white rounded transition cursor-pointer select-none"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-slate-800 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-white rounded transition cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      @ {formatRupiah(item.product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5 transition cursor-pointer"
                      title="Hapus item"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bill Calculation Details */}
      <div className="p-3 sm:p-4 bg-slate-50/70 border-t border-slate-200/80 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({itemCount} Jenis)</span>
          <span className="font-medium text-slate-900 tabular-nums">
            {formatRupiah(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>PB1 Restoran (10%)</span>
          <span className="font-medium text-slate-900 tabular-nums">
            {formatRupiah(tax)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 items-center">
          <button
            type="button"
            onClick={onApplyDiscount}
            className="hover:underline flex items-center gap-1 cursor-pointer text-slate-600"
          >
            <span>Diskon Promo</span>
            <span className="text-[10px] text-teal-600 font-semibold">(Ubah)</span>
          </button>
          <span className="font-semibold text-emerald-600 tabular-nums">
            {discount > 0 ? `-${formatRupiah(discount)}` : 'Rp 0'}
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-700">Total Tagihan</span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {formatRupiah(total)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {/* QRIS Button */}
          <button
            type="button"
            onClick={() => onSelectPaymentMethod('QRIS')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition cursor-pointer select-none ${
              paymentMethod === 'QRIS'
                ? 'bg-teal-50 border-2 border-teal-500 text-teal-800 font-semibold shadow-2xs'
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-0.5 ${
                paymentMethod === 'QRIS' ? 'text-teal-600' : 'text-slate-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs">QRIS</span>
          </button>

          {/* Tunai Button */}
          <button
            type="button"
            onClick={() => onSelectPaymentMethod('Tunai')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition cursor-pointer select-none ${
              paymentMethod === 'Tunai'
                ? 'bg-teal-50 border-2 border-teal-500 text-teal-800 font-semibold shadow-2xs'
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-0.5 ${
                paymentMethod === 'Tunai' ? 'text-teal-600' : 'text-slate-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs">Tunai</span>
          </button>

          {/* Debit Button */}
          <button
            type="button"
            onClick={() => onSelectPaymentMethod('Debit')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition cursor-pointer select-none ${
              paymentMethod === 'Debit'
                ? 'bg-teal-50 border-2 border-teal-500 text-teal-800 font-semibold shadow-2xs'
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-0.5 ${
                paymentMethod === 'Debit' ? 'text-teal-600' : 'text-slate-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs">Debit</span>
          </button>
        </div>

        {/* Big Checkout Button */}
        <button
          type="button"
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-99 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-slate-300"
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
          <span>
            {cart.length === 0
              ? 'Pilih Produk Terlebih Dahulu'
              : `Bayar & Cetak Struk (${formatRupiah(total)})`}
          </span>
        </button>
      </div>
    </section>
  );
};
