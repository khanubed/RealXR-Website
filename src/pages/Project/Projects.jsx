import React, { useState, useMemo, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Aperture } from "lucide-react";
import { PROJECTS, CATEGORIES } from "../../data/projectsPageData";

// Reused from the Resources feature — no changes needed
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterTabs } from "../../components/ui/FilterTabs";

import { FeaturedSpotlight } from "./components/FeaturedSpotlight";
import { ProjectCard } from "./components/ProjectCard";

export default function Projects() {
  useGSAP();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const headlineRef = useRef(null);
  const eyebrowRef = useRef(null);

  const featured = useMemo(() => PROJECTS.find((p) => p.featured), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const inCategory = category === "all" || p.category === category;
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return inCategory && inQuery;
    });
  }, [query, category]);

  // Headline reveal — split into words, stagger them up into place
  useEffect(() => {
    if (!headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll(".word-inner");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(words, { yPercent: 120, opacity: 0 });
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
      .to(words, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.05, ease: "power4.out" }, "-=0.2");
  }, []);

  const headline = "Projects in the field";

  return (
    <div className="min-h-screen pt-10 text-slate-900 space-400 relative">
      <div className="relative z-10 max-w-5xl mx-auto px-5 pt-16 pb-24">

        {/* Header */}
        <div className="text-center mb-14">
          <div ref={eyebrowRef} className="flex items-center justify-center gap-2 mb-5 opacity-0">
            <Aperture size={14} className="text-pink-500" />
            <span className="text-[0.68rem] font-bold tracking-[0.25em] uppercase text-slate-400 syne-700">
              RealXR · Project Archive
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="syne-800 text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] mb-5"
          >
            {headline.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0">
                <span className="word-inner inline-block bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            Everything the club has pointed a headset, a phone camera, or a browser
            tab at — shipped, shelved, or still in the lab.
          </p>
        </div>

        {/* Featured spotlight */}
        {featured && <div className="mb-14"><FeaturedSpotlight project={featured} /></div>}

        {/* Search & filters */}
        <div className="bg-white/60 backdrop-blur-xl border border-pink-500/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_4px_24px_rgba(6,182,212,0.06),0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex justify-center mb-6">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div>
            <p className="text-[0.68rem] font-bold tracking-widest uppercase text-slate-400 mb-2.5">
              Category
            </p>
            <FilterTabs options={CATEGORIES} active={category} onSelect={setCategory} accentColor="cyan" />
          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm font-medium text-slate-500">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          </p>
          {(query || category !== "all") && (
            <button
              onClick={() => { setQuery(""); setCategory("all"); }}
              className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-8 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-900/5">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Aperture className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="syne-700 text-xl text-slate-800 mb-2">Nothing in frame</h3>
            <p className="text-slate-500 text-sm">Try a different search term or clear your filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-xs text-slate-400 font-medium leading-loose">
          Built by the RealXR Web Dev Team · IES IPS Academy, Indore<br />
          <a href="mailto:realxr@iesipsacademy.ac.in" className="text-cyan-600 hover:text-pink-500 transition-colors group">
            Pitch a project <span className="inline-block transition-transform group-hover:translate-x-1">→</span> realxr@iesipsacademy.ac.in
          </a>
        </footer>
      </div>
    </div>
  );
}