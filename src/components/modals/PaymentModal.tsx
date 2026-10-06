import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../../types';
import { formatRupiah } from '../../data/mockData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  initialMethod: PaymentMethod;
  orderNumber: string;
  customerName: string;
  onConfirmPayment: (paymentDetails: {
    method: PaymentMethod;
    amountPaid?: number;
    change?: number;
    cardProvider?: string;
    approvalCode?: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  initialMethod,
  orderNumber,
  customerName,
  onConfirmPayment,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const [cashGiven, setCashGiven] = useState<number>(totalAmount);
  const [customCashInput, setCustomCashInput] = useState<string>(totalAmount.toString());
  const [cardProvider, setCardProvider] = useState<string>('BCA');
  const [approvalCode, setApprovalCode] = useState<string>('APV-' + Math.floor(100000 + Math.random() * 900000));
  const [qrisPaid, setQrisPaid] = useState<boolean>(false);

  useEffect(() => {
    setMethod(initialMethod);
    setCashGiven(totalAmount);
    setCustomCashInput(totalAmount.toString());
    setQrisPaid(false);
  }, [initialMethod, totalAmount, isOpen]);

  if (!isOpen) return null;

  const change = Math.max(0, cashGiven - totalAmount);
  const isCashSufficient = cashGiven >= totalAmount;

  // Preset cash values rounded to standard Indonesian Rupiah notes
  const presetOptions = [
    totalAmount, // Uang Pas
    Math.ceil(totalAmount / 50000) * 50000,
    Math.ceil(totalAmount / 100000) * 100000,
    50000,
    100000,
    200000,
    300000,
    500000,
  ].filter((val, idx, self) => val >= totalAmount && self.indexOf(val) === idx).slice(0, 5);

  const handleCashPreset = (amount: number) => {
    setCashGiven(amount);
    setCustomCashInput(amount.toString());
  };

  const handleCustomCashChange = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    setCustomCashInput(numeric);
    setCashGiven(Number(numeric) || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'Tunai' && !isCashSufficient) {
      return;
    }
    onConfirmPayment({
      method,
      amountPaid: method === 'Tunai' ? cashGiven : totalAmount,
      change: method === 'Tunai' ? change : 0,
      cardProvider: method === 'Debit' ? cardProvider : undefined,
      approvalCode: method === 'Debit' ? approvalCode : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{orderNumber}</span>
              <span className="text-xs text-slate-400">• {customerName}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Pilih Metode & Selesaikan Pembayaran</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Total Banner */}
        <div className="bg-teal-900 text-white p-4 flex items-center justify-between">
          <span className="text-xs font-medium text-teal-200">Total Yang Harus Dibayar</span>
          <span className="text-2xl font-extrabold tracking-tight tabular-nums">
            {formatRupiah(totalAmount)}
          </span>
        </div>

        {/* Method Switcher */}
        <div className="p-4 grid grid-cols-3 gap-2 border-b border-slate-100">
          {(['QRIS', 'Tunai', 'Debit'] as PaymentMethod[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                method === m
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Payment Detail Content */}
        <div className="p-5 flex-1 space-y-4">
          {method === 'QRIS' && (
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
                {/* Simulated QR Code SVG */}
                <svg className="w-44 h-44" viewBox="0 0 200 200" fill="none">
                  <rect width="200" height="200" fill="white" />
                  {/* Position detection corners */}
                  <rect x="15" y="15" width="45" height="45" rx="4" fill="#0f172a" />
                  <rect x="22" y="22" width="31" height="31" rx="2" fill="white" />
                  <rect x="27" y="27" width="21" height="21" rx="1" fill="#0d9488" />

                  <rect x="140" y="15" width="45" height="45" rx="4" fill="#0f172a" />
                  <rect x="147" y="22" width="31" height="31" rx="2" fill="white" />
                  <rect x="152" y="27" width="21" height="21" rx="1" fill="#0d9488" />

                  <rect x="15" y="140" width="45" height="45" rx="4" fill="#0f172a" />
                  <rect x="22" y="147" width="31" height="31" rx="2" fill="white" />
                  <rect x="27" y="152" width="21" height="21" rx="1" fill="#0d9488" />

                  {/* QR Pattern dots */}
                  <rect x="70" y="25" width="10" height="10" fill="#0f172a" />
                  <rect x="90" y="25" width="10" height="20" fill="#0f172a" />
                  <rect x="110" y="25" width="10" height="10" fill="#0f172a" />
                  <rect x="70" y="45" width="20" height="10" fill="#0f172a" />
                  <rect x="100" y="45" width="20" height="10" fill="#0f172a" />

                  <rect x="25" y="70" width="10" height="20" fill="#0f172a" />
                  <rect x="45" y="80" width="20" height="10" fill="#0f172a" />
                  <rect x="75" y="75" width="15" height="15" fill="#0d9488" />
                  <rect x="105" y="70" width="20" height="15" fill="#0f172a" />
                  <rect x="145" y="75" width="15" height="25" fill="#0f172a" />
                  <rect x="170" y="70" width="10" height="20" fill="#0f172a" />

                  <rect x="75" y="105" width="20" height="20" fill="#0f172a" />
                  <rect x="110" y="100" width="15" height="25" fill="#0d9488" />
                  <rect x="135" y="115" width="25" height="10" fill="#0f172a" />
                  <rect x="170" y="105" width="10" height="25" fill="#0f172a" />

                  <rect x="70" y="145" width="15" height="15" fill="#0f172a" />
                  <rect x="95" y="140" width="25" height="10" fill="#0f172a" />
                  <rect x="130" y="145" width="15" height="25" fill="#0f172a" />
                  <rect x="160" y="145" width="20" height="15" fill="#0d9488" />

                  <rect x="70" y="170" width="25" height="10" fill="#0f172a" />
                  <rect x="105" y="165" width="15" height="15" fill="#0f172a" />
                  <rect x="130" y="175" width="30" height="10" fill="#0f172a" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {qrisPaid ? 'Pembayaran Berhasil Terverifikasi' : 'Menunggu Scan QRIS Pelanggan...'}
                </span>
                <p className="text-[11px] text-slate-400">
                  NMID: ID10200829102 • ApexSME Coffee Flagship
                </p>
              </div>

              {!qrisPaid && (
                <button
                  type="button"
                  onClick={() => setQrisPaid(true)}
                  className="text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                >
                  ⚡ Simulasi Scan QRIS Berhasil
                </button>
              )}
            </div>
          )}

          {method === 'Tunai' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Uang Diterima dari Pelanggan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={customCashInput ? Number(customCashInput).toLocaleString('id-ID') : ''}
                    onChange={(e) => handleCustomCashChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none tabular-nums"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Presets */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                  Nominal Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleCashPreset(opt)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition cursor-pointer tabular-nums ${
                        cashGiven === opt
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt === totalAmount ? 'Uang Pas' : formatRupiah(opt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change calculation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Tagihan:</span>
                  <span className="font-semibold tabular-nums">{formatRupiah(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Uang Diterima:</span>
                  <span className="font-semibold tabular-nums">{formatRupiah(cashGiven)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-800">Kembalian:</span>
                  <span
                    className={`text-lg font-black tabular-nums ${
                      isCashSufficient ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isCashSufficient ? formatRupiah(change) : 'Uang Kurang!'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {method === 'Debit' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    EDC Terminal #01 Terhubung
                  </span>
                  <span>Port COM3</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Silakan gesek atau masukkan kartu debit pelanggan pada mesin EDC.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Bank / Penerbit Kartu
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['BCA', 'Mandiri', 'BRI', 'BNI'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setCardProvider(bank)}
                      className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        cardProvider === bank
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nomor Approval Code EDC
                </label>
                <input
                  type="text"
                  value={approvalCode}
                  onChange={(e) => setApprovalCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                  placeholder="Contoh: APV-882319"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={method === 'Tunai' && !isCashSufficient}
            className="flex-2 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Konfirmasi & Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
