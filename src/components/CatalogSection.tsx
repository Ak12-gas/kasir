import React from 'react';
import { Product } from '../types';
import { formatRupiah } from '../data/mockData';

interface CatalogSectionProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  catalogSearchQuery: string;
  onCatalogSearchChange: (query: string) => void;
  onAddToCart: (product: Product) => void;
  catalogSearchRef: React.RefObject<HTMLInputElement | null>;
  onSimulateBarcodeScan: () => void;
}

const CATEGORIES = [
  'Semua',
  'Kopi & Minuman',
  'Pastry & Roti',
  'Biji Kopi',
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  catalogSearchQuery,
  onCatalogSearchChange,
  onAddToCart,
  catalogSearchRef,
  onSimulateBarcodeScan,
}) => {
  return (
    <section
      id="catalog-section"
      className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-full"
    >
      {/* Search Menu Bar & Categories */}
      <div className="p-3 sm:p-4 border-b border-slate-100 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <input
            ref={catalogSearchRef}
            value={catalogSearchQuery}
            onChange={(e) => onCatalogSearchChange(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition placeholder:text-slate-400"
            placeholder="Cari menu, SKU, atau scan barcode [⌘F]..."
            type="text"
          />
          <button
            type="button"
            onClick={() => catalogSearchRef.current?.focus()}
            className="absolute right-2.5 top-2.5 text-[10px] font-mono bg-white text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs hover:text-slate-700 transition"
            title="Tekan ⌘F atau Ctrl+F"
          >
            ⌘F
          </button>
        </div>

        {/* Category Pills (Segmented Filter Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Items Grid */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto max-h-[560px] lg:max-h-[calc(100vh-320px)] min-h-[380px]">
        {products.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <svg
              className="w-12 h-12 stroke-1 mb-2 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <p className="text-sm font-semibold text-slate-700">Tidak ada produk ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau pilih kategori &quot;Semua&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onAddToCart(product)}
                className="p-3 bg-slate-50/70 hover:bg-teal-50/30 border border-slate-200/80 hover:border-teal-300 rounded-xl transition duration-150 flex flex-col justify-between group cursor-pointer select-none active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <h3
                      className="font-semibold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-tight group-hover:text-teal-900"
                      title={product.name}
                    >
                      {product.displayName || product.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {product.sku}
                    </span>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1 shadow-2xs"
                    title="Stok Tersedia"
                  />
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {formatRupiah(product.price)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-600 hover:text-white hover:border-teal-600 flex items-center justify-center transition shadow-2xs active:scale-95 cursor-pointer"
                    title={`Tambah ${product.name}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4v16m8-8H4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Hardware Scanner Status */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-teal-700 font-medium">
          <svg
            className="w-3.5 h-3.5 text-teal-600"
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
          <span>Pemindai USB: Siap memindai produk</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateBarcodeScan}
            className="text-[10px] text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-2 py-0.5 rounded font-medium transition cursor-pointer"
            title="Klik untuk mensimulasikan scan barcode"
          >
            Tes Scan
          </button>
          <span className="text-slate-400 hidden sm:inline">F2: Pencarian Manual</span>
        </div>
      </div>
    </section>
  );
};
