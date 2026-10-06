import React from 'react';

interface FooterProps {
  registerId: string;
  shiftName: string;
  shiftHours: string;
}

export const Footer: React.FC<FooterProps> = ({
  registerId,
  shiftName,
  shiftHours,
}) => {
  return (
    <footer className="bg-slate-500/10 border-t border-slate-300/60 px-4 py-2 text-[11px] text-slate-500 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">{registerId}</span>
          <span>•</span>
          <span>{shiftName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Online
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline tabular-nums">{shiftHours}</span>
        </div>
      </div>
    </footer>
  );
};
