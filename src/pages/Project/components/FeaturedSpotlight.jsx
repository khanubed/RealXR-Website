import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {  ArrowUpRight, PlayCircle, Radar } from "lucide-react";
import { STATUS } from "../../../data/projectsPageData";
import { MagneticLink } from "./MagneticLink";
import { Github } from "../../../assets/icons/icon";
export function FeaturedSpotlight({ project }) {
  const rootRef = useRef(null);
  const scanRef = useRef(null);

  useGSAP(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.15 }
    );

    if (!reduced && scanRef.current) {
      gsap.fromTo(
        scanRef.current,
        { yPercent: -10, opacity: 0 },
        {
          yPercent: 110,
          opacity: 1,
          duration: 2.6,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 1.4,
        }
      );
    }
  }, []);

  if (!project) return null;
  const status = STATUS[project.status];

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center gap-2 mb-5 pl-1">
        <Radar size={14} className="text-pink-500" />
        <span className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-slate-400 syne-700">
          Spotlight — currently tracking
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-0 rounded-[28px] border border-cyan-500/15 bg-white/55 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)]">
        {/* Preview / viewfinder panel */}
        <div className="relative aspect-[4/3] lg:aspect-auto min-h-[320px] overflow-hidden bg-gradient-to-br from-cyan-500/15 via-white to-pink-500/15">
          {/* corner reticle */}
          {["top-5 left-5 border-t-2 border-l-2", "top-5 right-5 border-t-2 border-r-2", "bottom-5 left-5 border-b-2 border-l-2", "bottom-5 right-5 border-b-2 border-r-2"].map((pos, i) => (
            <span key={i} className={`absolute w-6 h-6 border-cyan-500/50 rounded-[2px] ${pos}`} />
          ))}

          {/* scan line */}
          <div ref={scanRef} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="syne-800 text-6xl sm:text-7xl text-slate-900/10 select-none tracking-tight">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-900/5 text-[0.65rem] font-semibold text-slate-500 space-500">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            OBJ_{project.id.replace(/\D/g, "").padStart(2, "0")} · {project.platform}
          </div>
        </div>

        {/* Details panel */}
        <div className="p-7 sm:p-9 flex flex-col justify-center">
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <span
              className="text-[0.65rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5"
              style={{ color: status.color, background: `${status.color}12`, borderColor: `${status.color}35` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
              {status.label}
            </span>
            <span className="text-[0.65rem] font-semibold text-slate-400 space-500">{project.year}</span>
          </div>

          <h2 className="syne-800 text-3xl sm:text-4xl text-slate-900 leading-[1.05] mb-3">
            {project.title}
          </h2>
          <p className="text-slate-500 leading-relaxed mb-6 max-w-md">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-7">
            {project.stack.map((s) => (
              <span key={s} className="text-[0.7rem] px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 space-500">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <MagneticLink
              href={project.links.demo}
              className="items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-sm syne-700 shadow-[0_8px_24px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_30px_rgba(6,182,212,0.4)] transition-shadow"
            >
              <PlayCircle size={16} /> Watch demo
            </MagneticLink>
            <MagneticLink
              href={project.links.github}
              className="items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-900/10 text-slate-700 text-sm syne-700 hover:border-cyan-500/40 transition-colors"
            >
              <Github size={16} /> Source
            </MagneticLink>
            {project.links.live && project.links.live !== "#" && (
              <MagneticLink href={project.links.live} className="items-center gap-1 text-slate-400 hover:text-pink-500 text-sm space-500 transition-colors">
                Live <ArrowUpRight size={14} />
              </MagneticLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
