import React, { memo } from "react";
import { Star, Search, X } from "lucide-react";

export const C = {
  cyan: "text-cyan-500",
  pink: "text-pink-500",
};

const diffColor = {
  "Beginner": "bg-green-100 text-green-800 border-green-200",
  "Intermediate": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Advanced": "bg-red-100 text-red-800 border-red-200",
  "Beginner to Advanced": "bg-purple-100 text-purple-800 border-purple-200",
  "Self-paced": "bg-sky-100 text-sky-800 border-sky-200",
  "Research Paper": "bg-pink-100 text-pink-800 border-pink-200",
};

export const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < full ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
      <span className="text-[0.7rem] text-gray-500 ml-1">{rating}</span>
    </span>
  );
};

export const SearchBar = memo(function SearchBar({ value, onChange }) {
  return (
    <div className="relative  w-full max-w-xl group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-4 h-4 pointer-events-none transition-colors group-focus-within:text-pink-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search resources, authors, tags..."
        className="w-full py-3.5 syne-500 pr-4 pl-11 rounded-xl border border-cyan-500/20 bg-white/80 backdrop-blur-md text-sm text-gray-900 outline-none shadow-[0_4px_20px_rgba(6,182,212,0.08)] transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 font-['Space_Grotesk']"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X w={16} h={16} />
        </button>
      )}
    </div>
  );
});

export const FilterTabs = memo(function FilterTabs({ options, active, onSelect, accentColor }) {
  const isCyan = accentColor === C.cyan;
  
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`px-4 py-1.5 rounded-full text-xs syne-500 transition-all duration-300 backdrop-blur-md border ${
              isActive
                ? `text-white border-transparent shadow-lg ${
                    isCyan ? "bg-gradient-to-br from-cyan-400 to-pink-500 shadow-cyan-500/30" : "bg-gradient-to-br from-pink-400 to-pink-600 shadow-pink-500/30"
                  } font-bold`
                : "bg-white/70 text-gray-500 border-gray-200/50 hover:bg-white hover:border-gray-300 font-medium"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});

export const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/60 backdrop-blur-md p-6">
    <div className="flex gap-4 items-start">
      <div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-1/3 bg-slate-100 rounded-md" />
        <div className="h-5 w-3/4 bg-slate-100 rounded-md" />
        <div className="h-3 w-11/12 bg-slate-100 rounded-md" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-md" />
      </div>
    </div>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);