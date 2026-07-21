import React, { useState, useRef, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Glasses, ScanEye, Boxes, Globe, Gamepad2, Wrench,
  ExternalLink, ChevronDown, Users,
} from "lucide-react";
import { CATEGORIES, STATUS } from "../../../data/projectsPageData";
import { MagneticLink } from "./MagneticLink";
import  {Github} from "../../../assets/icons/icon"

const CATEGORY_ICON = {
  ar: ScanEye,
  vr: Glasses,
  mr: Boxes,
  webxr: Globe,
  game: Gamepad2,
  tool: Wrench,
};

export const ProjectCard = memo(function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const dropRef = useRef(null);
  const Icon = CATEGORY_ICON[project.category] ?? Boxes;
  const status = STATUS[project.status];
  const categoryLabel = CATEGORIES.find((c) => c.id === project.category)?.label ?? project.category;

  // Card entrance animation
  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: index * 0.06 }
    );
  }, { dependencies: [index], scope: cardRef });

  // Dropdown expand/collapse animation
  useGSAP(() => {
    const el = dropRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power3.in" });
    }
  }, { dependencies: [open], scope: cardRef });

  return (
    <div
      ref={cardRef}
      onClick={() => setOpen((o) => !o)}
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-300
        ${open
          ? "bg-white/85 border-cyan-400/40 shadow-[0_10px_36px_rgba(6,182,212,0.12)]"
          : "bg-white/60 border-slate-900/5 hover:bg-white/85 hover:border-cyan-400/30 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]"
        }`}
    >
      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cyan-500/10 via-white to-pink-500/10">
        {/* reticle corners — appear on hover, like an AR bounding box acquiring a target */}
        {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((pos, i) => (
          <span
            key={i}
            className={`absolute w-4 h-4 rounded-[2px] border-cyan-500/60 transition-all duration-300 ${pos} ${
              open ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            }`}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={34} strokeWidth={1.4} className="text-slate-900/15" />
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border flex items-center gap-1"
            style={{ color: status.color, background: `${status.color}14`, borderColor: `${status.color}30` }}
          >
            {project.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
            {status.label}
          </span>
        </div>

        <span className="absolute bottom-3 right-3 text-[0.65rem] font-semibold text-slate-400 space-500">
          {project.year}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-cyan-600 space-500">
            {categoryLabel}
          </span>
        </div>

        <h3 className="syne-700 text-lg text-slate-900 leading-snug mb-1.5">{project.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{project.tagline}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 2).map((s) => (
              <span key={s} className="text-[0.65rem] px-2 py-0.5 rounded-full bg-slate-900/5 text-slate-500 space-500">
                {s}
              </span>
            ))}
            {project.stack.length > 2 && (
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-slate-900/5 text-slate-400 space-500">
                +{project.stack.length - 2}
              </span>
            )}
          </div>
          <ChevronDown size={16} className={`shrink-0 text-cyan-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>

        {/* Expanded detail */}
        <div ref={dropRef} className="h-0 opacity-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="mt-4 pt-4 border-t border-cyan-500/10">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{project.description}</p>

            <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500">
              <Users size={13} className="text-pink-500" />
              {project.team.map((m) => m.name).join(", ")}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.stack.map((s) => (
                <span key={s} className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 space-500">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {project.links.live && project.links.live !== "#" && (
                <MagneticLink
                  href={project.links.live}
                  className="items-center gap-1.5 px-4 py-2 rounded-lg text-xs syne-700 bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-[0_4px_14px_rgba(6,182,212,0.3)]"
                >
                  Live <ExternalLink size={12} />
                </MagneticLink>
              )}
              <MagneticLink
                href={project.links.github}
                className="items-center gap-1.5 px-4 py-2 rounded-lg text-xs syne-700 bg-white text-slate-700 border border-slate-900/10 hover:border-cyan-500/40"
              >
                <Github size={12} /> Code
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});