import React, { useState, useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Play, GraduationCap, Wrench, FileText, BookOpen, PenTool, 
  ChevronDown, Star, Calendar, Clock, Folder, Heart, ExternalLink 
} from "lucide-react";
import { RESOURCE_TYPES, CATEGORIES } from "../../../data/resourceData";
import { Github } from "../../../assets/icons/icon.jsx";

const diffStyles = {
  "Beginner": "bg-green-100 text-green-700 border border-green-200",
  "Intermediate": "bg-amber-100 text-amber-700 border border-amber-200",
  "Advanced": "bg-red-100 text-red-700 border border-red-200",
  "Beginner to Advanced": "bg-purple-100 text-purple-700 border border-purple-200",
  "Self-paced": "bg-sky-100 text-sky-700 border border-sky-200",
  "Research Paper": "bg-rose-100 text-rose-700 border border-rose-200",
};



const TypeIcon = ({ type, color }) => {
  const props = { size: 20, color };
  switch (type) {
    case "video": return <Play {...props} />;
    case "course": return <GraduationCap {...props} />;
    case "tool": return <Wrench {...props} />;
    case "paper": return <FileText {...props} />;
    case "repo": return <Github {...props} />;
    case "docs": return <BookOpen {...props} />;
    default: return <PenTool {...props} />;
  }
};

export const ResourceCard = memo(function ResourceCard({ item, index }) {
  useGSAP();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: index * 0.045 }
    );
  }, [index]);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.38, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power3.in" });
    }
  }, [open]);

  const typeData = RESOURCE_TYPES[item.type] ?? { label: item.type, color: "#6b7280" };

  return (
    <div
      ref={cardRef}
      onClick={() => setOpen((o) => !o)}
      className={`group relative overflow-hidden backdrop-blur-xl border rounded-2xl p-5 cursor-pointer transition-all duration-300
        ${open 
          ? "bg-white/80 border-cyan-400/40 shadow-[0_8px_32px_rgba(6,182,212,0.1),0_2px_8px_rgba(236,72,153,0.06)]" 
          : "bg-white/60 border-pink-500/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:bg-white/90 hover:shadow-[0_8px_28px_rgba(6,182,212,0.12),0_2px_8px_rgba(236,72,153,0.08)]"
        }`}
    >
      {/* Header section */}
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div 
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{ background: `${typeData.color}14`, borderColor: `${typeData.color}28` }}
        >
          <TypeIcon type={item.type} color={typeData.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            {item.featured && (
              <span className="text-[0.6rem] font-bold tracking-widest uppercase text-pink-500 bg-pink-50 border border-pink-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={10} className="fill-pink-500" /> Featured
              </span>
            )}
            <span 
              className="text-[0.65rem] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
              style={{ color: typeData.color, background: `${typeData.color}10`, borderColor: `${typeData.color}30` }}
            >
              {typeData.label}
            </span>
            <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${diffStyles[item.difficulty] || diffStyles["Beginner"]}`}>
              {item.difficulty}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1.5 font-['Syne']">
            {item.title}
          </h3>

          <p className="text-sm text-slate-500 leading-relaxed mb-2 line-clamp-2">
            {item.excerpt}
          </p>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-[0.75rem] text-slate-400 font-medium">
            <span>By <strong className="text-slate-600 font-semibold">{item.author}</strong></span>
            <span className="flex items-center gap-1"><Clock size={12} /> {item.readTime}</span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star size={12} className="fill-amber-500" /> {item.stars}
            </span>
            <span className="flex items-center gap-1 text-pink-500">
              <Heart size={12} className="fill-pink-500" /> {item.saves}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <div className={`shrink-0 text-cyan-500 mt-1 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown size={20} />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3 pl-15">
        {item.tags.map(tag => (
          <span key={tag} className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Expanded Dropdown */}
      <div ref={dropRef} className="h-0 opacity-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="mt-5 pt-5 border-t border-cyan-500/10">
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-6 mb-5 px-4 py-3 bg-cyan-50 rounded-xl border border-cyan-500/10 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-cyan-500"/> <strong>Published:</strong> {new Date(item.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><Folder size={14} className="text-cyan-500"/> <strong>Category:</strong> {CATEGORIES.find(c => c.id === item.category)?.label ?? item.category}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {item.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5
                  ${link.primary 
                    ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-[0_4px_14px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.4)]" 
                    : "bg-white text-cyan-600 border border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-sm"
                  }`}
              >
                {link.label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});