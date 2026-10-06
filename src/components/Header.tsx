import React, { useState } from 'react';
import { OUTLETS } from '../data/mockData';

interface HeaderProps {
  currentOutlet: string;
  onSelectOutlet: (outlet: string) => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (query: string) => void;
  onGlobalSearchSubmit: (e: React.FormEvent) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  currentOutlet,
  onSelectOutlet,
  globalSearchQuery,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  searchRef,
}) => {
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 py-2.5 max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Outlet Selector */}
        <div className="flex items-center gap-3">
          {/* Brand Logo Badge */}
          <div className="flex items-center bg-slate-900 text-white rounded-lg px-2.5 py-1.5 shadow-sm select-none">
            <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center font-bold text-xs mr-2 text-slate-950">
              A
            </div>
            <span className="font-bold text-sm tracking-tight">ApexSME</span>
            <span className="ml-2 text-[10px] font-semibold bg-teal-600/30 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30">
              POS
            </span>
          </div>

          {/* Outlet Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
              className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-teal-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-normal leading-none">
                  Active Outlet
                </p>
                <p className="font-semibold text-slate-800 leading-tight">
                  {currentOutlet}
                </p>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform ${
                  isOutletDropdownOpen ? 'rotate-180' : ''
                }`}
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

            {isOutletDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOutletDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pilih Outlet
                  </div>
                  {OUTLETS.map((outlet) => (
                    <button
                      key={outlet}
                      type="button"
                      onClick={() => {
                        onSelectOutlet(outlet);
                        setIsOutletDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition ${
                        currentOutlet === outlet
                          ? 'text-teal-700 font-semibold bg-teal-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{outlet}</span>
                      {currentOutlet === outlet && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Global Search Bar */}
        <div className="order-3 lg:order-2 flex-1 max-w-xl min-w-[240px]">
          <form onSubmit={onGlobalSearchSubmit} className="relative">
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
              ref={searchRef}
              value={globalSearchQuery}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              className="w-full pl-9 pr-14 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs border border-transparent focus:border-teal-500 rounded-lg outline-none transition placeholder:text-slate-400 shadow-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Scan barcode or search SKU / Item [F2]..."
              type="text"
            />
            <button
              type="button"
              onClick={() => searchRef.current?.focus()}
              className="absolute right-2.5 top-1.5 text-[10px] font-mono bg-white text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs hover:text-slate-700 transition"
              title="Tekan F2 untuk fokus ke pencarian global"
            >
              F2
            </button>
          </form>
        </div>

        {/* Right Cashier & Hardware Status */}
        <div className="order-2 lg:order-3 flex items-center gap-3">
          {/* Scanner Ready Indicator */}
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scanner Ready</span>
          </div>

          {/* Cashier Profile */}
          <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                Rian Pratama
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Head Cashier #4402
              </div>
            </div>
            <div className="relative">
              <img
                alt="Rian Pratama"
                className="w-8 h-8 rounded-full ring-2 ring-teal-500/30 object-cover bg-teal-100"
                src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image blocked
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-8 h-8 rounded-full ring-2 ring-teal-500/30 bg-teal-600 text-white font-bold text-xs flex items-center justify-center -ml-8 pointer-events-none hidden" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
