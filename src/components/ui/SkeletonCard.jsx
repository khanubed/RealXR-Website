import React from "react";

export const SkeletonCard = () => (
  <div className="relative bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-5 overflow-hidden">
    <div className="flex gap-4 items-start">
      <div className="w-11 h-11 rounded-xl bg-slate-200/50 animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-1/4 bg-slate-200/50 rounded-md animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-200/50 rounded-md animate-pulse" />
        <div className="h-3 w-full bg-slate-200/50 rounded-md animate-pulse" />
        <div className="h-3 w-2/3 bg-slate-200/50 rounded-md animate-pulse" />
      </div>
    </div>
    {/* Shimmer Overlay */}
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
  </div>
);