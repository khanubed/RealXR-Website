import React, { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = memo(function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <PagBtn 
        icon={<ChevronLeft className="w-4 h-4" />} 
        disabled={page === 1} 
        onClick={() => onChange(page - 1)} 
      />
      {pages.map((p) => (
        <PagBtn
          key={p}
          label={String(p)}
          active={p === page}
          onClick={() => onChange(p)}
        />
      ))}
      <PagBtn 
        icon={<ChevronRight className="w-4 h-4" />} 
        disabled={page === totalPages} 
        onClick={() => onChange(page + 1)} 
      />
    </div>
  );
});

const PagBtn = ({ label, icon, active, disabled, onClick }) => (
  <button
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
    className={`min-w-[36px] h-9 rounded-lg flex items-center justify-center px-2 text-sm backdrop-blur-md transition-all duration-200 border
      ${active 
        ? "bg-gradient-to-br from-cyan-500 to-pink-500 text-white font-bold border-transparent shadow-[0_4px_12px_rgba(6,182,212,0.3)]" 
        : disabled
          ? "bg-white/40 text-slate-300 border-slate-100 cursor-not-allowed"
          : "bg-white/70 text-slate-700 border-slate-200 hover:bg-white font-medium cursor-pointer"
      }`}
  >
    {icon || label}
  </button>
);