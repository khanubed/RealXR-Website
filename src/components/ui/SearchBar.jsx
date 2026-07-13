import React, { memo } from "react";
import { Search, X } from "lucide-react";

export const SearchBar = memo(function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search resources, authors, tags..."
        className="w-full py-3.5 pl-12 pr-12 rounded-xl border border-cyan-500/20 bg-white/80 backdrop-blur-md text-slate-800 text-sm font-['Space_Grotesk'] outline-none shadow-[0_4px_20px_rgba(6,182,212,0.08),inset_0_1px_2px_rgba(0,0,0,0.03)] transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});