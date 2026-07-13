import React, { memo } from "react";

export const FilterTabs = memo(function FilterTabs({ options, active, onSelect, accentColor }) {
  // Using custom classes dynamically based on the passed accent (cyan or pink)
  const activeClassMap = {
    cyan: "bg-gradient-to-br from-cyan-500 to-pink-500 text-white shadow-[0_3px_10px_rgba(6,182,212,0.25)] border-transparent",
    pink: "bg-gradient-to-br from-pink-500 to-cyan-500 text-white shadow-[0_3px_10px_rgba(236,72,153,0.25)] border-transparent"
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-['Space_Grotesk'] border backdrop-blur-md transition-all duration-200
              ${isActive 
                ? `${activeClassMap[accentColor]} font-bold` 
                : "bg-white/70 text-slate-500 border-slate-900/10 hover:bg-white/90 font-medium"
              }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});