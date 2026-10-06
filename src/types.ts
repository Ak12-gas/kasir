export interface Product {
  id: string;
  name: string;
  displayName?: string;
  sku: string;
  category: 'Kopi & Minuman' | 'Pastry & Roti' | 'Biji Kopi' | 'Makanan Ringan';
  price: number;
  inStock: boolean;
  defaultNote?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export type OrderType = 'Dine In' | 'Take Away' | 'Delivery';

export type PaymentMethod = 'QRIS' | 'Tunai' | 'Debit';

export interface Transaction {
  id: string;
  orderNumber: string;
  timestamp: string;
  time: string;
  orderType: OrderType;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid?: number;
  change?: number;
  cashierName: string;
  cashierId: string;
  outletName: string;
  registerId: string;
}

export interface HeldOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  orderType: OrderType;
  items: CartItem[];
  timestamp: string;
  time: string;
  discount: number;
}

export interface ShiftInfo {
  shiftNumber: string;
  shiftHours: string;
  cashierName: string;
  cashierId: string;
  registerId: string;
  outletName: string;
  startingCash: number;
  cashDrawer: number;
  totalSales: number;
  totalTransactions: number;
  status: 'Seimbang' | 'Selisih' | 'Ditutup';
}
