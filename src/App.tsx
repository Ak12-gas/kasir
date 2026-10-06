/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { CatalogSection } from './components/CatalogSection';
import { CartSection } from './components/CartSection';
import { HistorySection } from './components/HistorySection';
import { Footer } from './components/Footer';

// Modals
import { PaymentModal } from './components/modals/PaymentModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { ShiftSummaryModal } from './components/modals/ShiftSummaryModal';
import { EndShiftModal } from './components/modals/EndShiftModal';
import { AllReceiptsModal } from './components/modals/AllReceiptsModal';
import { HeldOrdersModal } from './components/modals/HeldOrdersModal';
import { ItemNoteModal } from './components/modals/ItemNoteModal';
import { DiscountModal } from './components/modals/DiscountModal';

// Mock Data & Types
import {
  INITIAL_PRODUCTS,
  INITIAL_CART,
  INITIAL_TRANSACTIONS,
  INITIAL_SHIFT_INFO,
} from './data/mockData';
import {
  Product,
  CartItem,
  Transaction,
  OrderType,
  PaymentMethod,
  ShiftInfo,
  HeldOrder,
} from './types';

export default function App() {
  // Outlet & Cashier state
  const [currentOutlet, setCurrentOutlet] = useState('Central Jakarta Flagship');
  const [shiftInfo, setShiftInfo] = useState<ShiftInfo>(INITIAL_SHIFT_INFO);

  // Catalog State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Cart & Active Order State
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [currentOrderNumber, setCurrentOrderNumber] = useState('#TRX-9430');
  const [orderType, setOrderType] = useState<OrderType>('Dine In');
  const [customerName, setCustomerName] = useState('Pelanggan Umum (Walk-in)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [discount, setDiscount] = useState<number>(0);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);

  // History & Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Mobile Tab State ('catalog' | 'cart' | 'history')
  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart' | 'history'>('catalog');

  // Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [isShiftSummaryModalOpen, setIsShiftSummaryModalOpen] = useState(false);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [isAllReceiptsModalOpen, setIsAllReceiptsModalOpen] = useState(false);
  const [isHeldOrdersModalOpen, setIsHeldOrdersModalOpen] = useState(false);
  const [isItemNoteModalOpen, setIsItemNoteModalOpen] = useState(false);
  const [itemForNote, setItemForNote] = useState<CartItem | null>(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Input references for keyboard shortcuts
  const globalSearchRef = useRef<HTMLInputElement>(null);
  const catalogSearchRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Keyboard shortcut listeners (F2, Cmd+F/Ctrl+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        globalSearchRef.current?.focus();
        globalSearchRef.current?.select();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        catalogSearchRef.current?.focus();
        catalogSearchRef.current?.select();
      } else if (e.key === 'Escape') {
        setIsPaymentModalOpen(false);
        setIsReceiptModalOpen(false);
        setIsShiftSummaryModalOpen(false);
        setIsEndShiftModalOpen(false);
        setIsAllReceiptsModalOpen(false);
        setIsHeldOrdersModalOpen(false);
        setIsItemNoteModalOpen(false);
        setIsDiscountModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const searchLower = catalogSearchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower);
    return matchCat && matchSearch;
  });

  // Filtered Receipts for History Column
  const filteredTransactions = transactions.filter((t) => {
    const q = historySearchQuery.toLowerCase();
    return (
      t.orderNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.paymentMethod.toLowerCase().includes(q)
    );
  });

  // Add product to cart handler
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            note: product.defaultNote || undefined,
          },
        ];
      }
    });
    showToast(`Ditambahkan: ${product.name}`);
  };

  // Quantity stepper handler
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  // Remove single item
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Clear all items in cart
  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscount(0);
    showToast('Keranjang pesanan telah dikosongkan');
  };

  // Global search submission (e.g. barcode scan hit enter)
  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = globalSearchQuery.trim();
    if (!query) return;

    // Search by SKU or Name exact / partial match
    const found = products.find(
      (p) =>
        p.sku.toLowerCase() === query.toLowerCase() ||
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      handleAddToCart(found);
      setGlobalSearchQuery('');
    } else {
      showToast(`SKU/Item "${query}" tidak ditemukan`);
    }
  };

  // Simulate hardware barcode scan
  const handleSimulateBarcodeScan = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    handleAddToCart(randomProduct);
    showToast(`Pemindai USB memindai [${randomProduct.sku}] ${randomProduct.name}`);
  };

  // Hold current order
  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    const newHeld: HeldOrder = {
      id: `held-${Date.now()}`,
      orderNumber: currentOrderNumber,
      customerName,
      orderType,
      items: [...cart],
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      discount,
    };
    setHeldOrders((prev) => [newHeld, ...prev]);

    // Reset current active order to a new order sequence
    const nextSeq = parseInt(currentOrderNumber.replace(/\D/g, '') || '9430') + 1;
    setCurrentOrderNumber(`#TRX-${nextSeq}`);
    setCustomerName('Pelanggan Umum (Walk-in)');
    setCart([]);
    setDiscount(0);
    showToast(`Pesanan ${newHeld.orderNumber} berhasil ditahan`);
  };

  // Resume a held order
  const handleResumeOrder = (held: HeldOrder) => {
    setCurrentOrderNumber(held.orderNumber);
    setCustomerName(held.customerName);
    setOrderType(held.orderType);
    setCart(held.items);
    setDiscount(held.discount || 0);
    setHeldOrders((prev) => prev.filter((o) => o.id !== held.id));
    setIsHeldOrdersModalOpen(false);
    showToast(`Pesanan ${held.orderNumber} dibuka kembali`);
  };

  const handleDeleteHeldOrder = (id: string) => {
    setHeldOrders((prev) => prev.filter((o) => o.id !== id));
    showToast('Pesanan tertahan dihapus');
  };

  // Edit item note
  const handleOpenItemNote = (item: CartItem) => {
    setItemForNote(item);
    setIsItemNoteModalOpen(true);
  };

  const handleSaveItemNote = (productId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, note } : item
      )
    );
    showToast('Catatan pesanan diperbarui');
  };

  // Checkout & Payment completion
  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (details: {
    method: PaymentMethod;
    amountPaid?: number;
    change?: number;
    cardProvider?: string;
    approvalCode?: string;
  }) => {
    const subtotal = cart.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.1);
    const total = Math.max(0, subtotal + tax - discount);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const completedTx: Transaction = {
      id: `trx-${Date.now()}`,
      orderNumber: currentOrderNumber,
      timestamp: now.toISOString(),
      time: timeStr,
      orderType,
      customerName,
      items: [...cart],
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: details.method,
      amountPaid: details.amountPaid,
      change: details.change,
      cashierName: 'Rian Pratama',
      cashierId: '#4402',
      outletName: currentOutlet,
      registerId: 'Register #01',
    };

    // Update transactions history
    setTransactions((prev) => [completedTx, ...prev]);

    // Update Shift Metrics
    setShiftInfo((prev) => ({
      ...prev,
      totalSales: prev.totalSales + total,
      totalTransactions: prev.totalTransactions + 1,
      cashDrawer:
        details.method === 'Tunai'
          ? prev.cashDrawer + total
          : prev.cashDrawer,
    }));

    // Close payment modal and open receipt
    setIsPaymentModalOpen(false);
    setSelectedReceipt(completedTx);
    setIsReceiptModalOpen(true);

    // Prepare next order
    const nextSeq = parseInt(currentOrderNumber.replace(/\D/g, '') || '9430') + 1;
    setCurrentOrderNumber(`#TRX-${nextSeq}`);
    setCustomerName('Pelanggan Umum (Walk-in)');
    setCart([]);
    setDiscount(0);

    showToast(`Transaksi ${completedTx.orderNumber} berhasil diselesaikan!`);
  };

  // Reprint existing receipt
  const handleReprintReceipt = (tx: Transaction) => {
    setSelectedReceipt(tx);
    setIsReceiptModalOpen(true);
  };

  // End shift action
  const handleConfirmEndShift = (data: {
    actualCash: number;
    difference: number;
    notes: string;
  }) => {
    setShiftInfo((prev) => ({
      ...prev,
      cashDrawer: data.actualCash,
      status: data.difference === 0 ? 'Seimbang' : 'Selisih',
    }));
    showToast('Shift berhasil ditutup dan direkonsiliasi.');
  };

  // Calculations for current cart
  const activeSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const activeTax = Math.round(activeSubtotal * 0.1);
  const activeTotal = Math.max(0, activeSubtotal + activeTax - discount);

  return (
    <div className="bg-[#F4F6F9] text-slate-800 min-h-screen flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP APP BAR */}
      <Header
        currentOutlet={currentOutlet}
        onSelectOutlet={setCurrentOutlet}
        globalSearchQuery={globalSearchQuery}
        onGlobalSearchChange={setGlobalSearchQuery}
        onGlobalSearchSubmit={handleGlobalSearchSubmit}
        searchRef={globalSearchRef}
      />

      {/* QUICK METRIC & SHIFT BAR */}
      <MetricsBar
        shiftInfo={shiftInfo}
        onOpenShiftSummary={() => setIsShiftSummaryModalOpen(true)}
        onOpenEndShift={() => setIsEndShiftModalOpen(true)}
      />

      {/* MOBILE NAVIGATION TABS (Visible on screen < lg) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 sticky top-[57px] z-20">
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setMobileTab('catalog')}
            className={`flex-1 py-1.5 rounded-md text-center transition cursor-pointer ${
              mobileTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog Menu
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('cart')}
            className={`flex-1 py-1.5 rounded-md text-center transition flex items-center justify-center gap-1 cursor-pointer ${
              mobileTab === 'cart'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pesanan Aktif</span>
            {cart.length > 0 && (
              <span className="w-4 h-4 bg-teal-600 text-white rounded-full text-[10px] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('history')}
            className={`flex-1 py-1.5 rounded-md text-center transition cursor-pointer ${
              mobileTab === 'history'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Struk
          </button>
        </div>
      </div>

      {/* MAIN POS WORKSPACE */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUMN 1: MENU & CATALOG (Desktop: 5 cols, Mobile: controlled by mobileTab) */}
        <div
          className={`lg:col-span-5 h-full ${
            mobileTab === 'catalog' ? 'block' : 'hidden lg:block'
          }`}
        >
          <CatalogSection
            products={filteredProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            catalogSearchQuery={catalogSearchQuery}
            onCatalogSearchChange={setCatalogSearchQuery}
            onAddToCart={handleAddToCart}
            catalogSearchRef={catalogSearchRef}
            onSimulateBarcodeScan={handleSimulateBarcodeScan}
          />
        </div>

        {/* COLUMN 2: ACTIVE ORDER & CHECKOUT (Desktop: 4 cols, Mobile: controlled by mobileTab) */}
        <div
          className={`lg:col-span-4 h-full ${
            mobileTab === 'cart' ? 'block' : 'hidden lg:block'
          }`}
        >
          <CartSection
            currentOrderNumber={currentOrderNumber}
            orderType={orderType}
            onChangeOrderType={setOrderType}
            customerName={customerName}
            onChangeCustomerName={setCustomerName}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onOpenItemNote={handleOpenItemNote}
            onHoldOrder={handleHoldOrder}
            heldOrdersCount={heldOrders.length}
            onViewHeldOrders={() => setIsHeldOrdersModalOpen(true)}
            onClearCart={handleClearCart}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            discount={discount}
            onApplyDiscount={() => setIsDiscountModalOpen(true)}
            onCheckout={handleCheckoutClick}
          />
        </div>

        {/* COLUMN 3: RECEIPT HISTORY (Desktop: 3 cols, Mobile: controlled by mobileTab) */}
        <div
          className={`lg:col-span-3 h-full ${
            mobileTab === 'history' ? 'block' : 'hidden lg:block'
          }`}
        >
          <HistorySection
            transactions={filteredTransactions}
            searchQuery={historySearchQuery}
            onSearchChange={setHistorySearchQuery}
            onReprintReceipt={handleReprintReceipt}
            onViewAllReceipts={() => setIsAllReceiptsModalOpen(true)}
            totalTransactionsCount={transactions.length}
          />
        </div>
      </main>

      {/* BOTTOM STATUS FOOTER */}
      <Footer
        registerId={shiftInfo.registerId}
        shiftName="Shift Siang"
        shiftHours="08:00 - 16:00"
      />

      {/* MODALS */}
      {/* 1. Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={activeTotal}
        initialMethod={paymentMethod}
        orderNumber={currentOrderNumber}
        customerName={customerName}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* 2. Receipt View & Print Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedReceipt}
      />

      {/* 3. Shift Summary Modal */}
      <ShiftSummaryModal
        isOpen={isShiftSummaryModalOpen}
        onClose={() => setIsShiftSummaryModalOpen(false)}
        shiftInfo={shiftInfo}
        transactions={transactions}
      />

      {/* 4. End Shift Modal */}
      <EndShiftModal
        isOpen={isEndShiftModalOpen}
        onClose={() => setIsEndShiftModalOpen(false)}
        shiftInfo={shiftInfo}
        onConfirmEndShift={handleConfirmEndShift}
      />

      {/* 5. All Receipts Modal */}
      <AllReceiptsModal
        isOpen={isAllReceiptsModalOpen}
        onClose={() => setIsAllReceiptsModalOpen(false)}
        transactions={transactions}
        onSelectReceipt={handleReprintReceipt}
      />

      {/* 6. Held Orders Modal */}
      <HeldOrdersModal
        isOpen={isHeldOrdersModalOpen}
        onClose={() => setIsHeldOrdersModalOpen(false)}
        heldOrders={heldOrders}
        onResumeOrder={handleResumeOrder}
        onDeleteHeldOrder={handleDeleteHeldOrder}
      />

      {/* 7. Item Note Editor Modal */}
      <ItemNoteModal
        isOpen={isItemNoteModalOpen}
        onClose={() => setIsItemNoteModalOpen(false)}
        item={itemForNote}
        onSaveNote={handleSaveItemNote}
      />

      {/* 8. Discount & Promo Modal */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        subtotal={activeSubtotal}
        currentDiscount={discount}
        onApplyDiscount={(val) => {
          setDiscount(val);
          showToast(`Diskon promo diterapkan`);
        }}
      />
    </div>
  );
}
