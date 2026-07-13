import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Search, ExternalLink, Users, Activity, Layers, Code2, ChevronDown } from "lucide-react";
import { fetchProjects, PROJECT_CATEGORIES, PROJECT_STATUS } from "../../data/projectsPageData";
import { Github } from "../../assets/icons/icon.jsx";
// Reusable Components (from previous response)
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterTabs } from "../../components/ui/FilterTabs";
import { Pagination } from "../../components/ui/Pagination";
import { SkeletonCard } from "../../components/ui/SkeletonCard";

const PER_PAGE = 10;

// ── Status Badges ─────────────────────────────────────────────────
const statusStyles = {
  "live": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "beta": "bg-amber-100 text-amber-700 border-amber-200",
  "development": "bg-blue-100 text-blue-700 border-blue-200",
};

// ── Project Card Component ────────────────────────────────────────
const ProjectCard = React.memo(function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const cardRef = useRef(null);

  // Entrance Stagger
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)", delay: index * 0.05 }
    );
  }, [index]);

  // Dropdown Animation
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in" });
    }
  }, [open]);

  return (
    <div
      ref={cardRef}
      onClick={() => setOpen((o) => !o)}
      className={`group relative overflow-hidden  backdrop-blur-xl border rounded-2xl cursor-pointer transition-all duration-300 flex flex-col sm:flex-row
        ${open 
          ? "bg-white/80 border-cyan-400/40 shadow-[0_8px_32px_rgba(6,182,212,0.1),0_2px_8px_rgba(236,72,153,0.06)]" 
          : "bg-white/60 border-slate-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:bg-white/90 hover:shadow-[0_8px_28px_rgba(6,182,212,0.12),0_2px_8px_rgba(236,72,153,0.08)]"
        }`}
    >
      {/* Visual Thumbnail (Left side on desktop, top on mobile) */}
      <div className={`sm:w-48 h-32 sm:h-auto shrink-0 bg-gradient-to-br ${project.thumbnailGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_10%,transparent_80%)] mix-blend-overlay" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        {project.featured && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[0.65rem] font-bold tracking-widest uppercase text-slate-900 shadow-lg flex items-center gap-1">
            <Activity size={12} className="text-pink-500" /> Featured
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusStyles[project.status]}`}>
                {PROJECT_STATUS.find(s => s.id === project.status)?.label}
              </span>
              <span className="text-[0.65rem] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                <Layers size={10} /> {PROJECT_CATEGORIES.find(c => c.id === project.category)?.label}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight font-['Syne']">
              {project.title}
            </h3>
          </div>
          
          {/* Chevron */}
          <div className={`shrink-0 text-cyan-500 bg-cyan-50 p-1.5 rounded-full transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
            <ChevronDown size={18} />
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
          {project.excerpt}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-2 mt-auto">
          {project.techStack.map(tech => (
            <span key={tech} className="text-[0.68rem] px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 font-medium flex items-center gap-1">
              <Code2 size={10} className="text-cyan-500" /> {tech}
            </span>
          ))}
        </div>

        {/* Expanded Details */}
        <div ref={dropRef} className="h-0 opacity-0 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="mt-5 pt-5 border-t border-slate-200/60">
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 rounded-xl p-4 border border-slate-100">
              
              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <Users size={14} className="text-pink-500" /> {project.teamSize} Members
                </span>
                <span>Est. {new Date(project.date).getFullYear()}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {project.githubUrl !== "#" && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 transition-colors hover:shadow-sm">
                    <Github size={14} /> Repository
                  </a>
                )}
                {project.liveUrl !== "#" && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-[0_4px_14px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.4)] transition-all hover:-translate-y-0.5">
                    View Live <ExternalLink size={12} />
                  </a>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── Main Projects Page ────────────────────────────────────────────
export default function Projects() {
  const [projects, setProjects]    = useState([]);
  const [total, setTotal]          = useState(0);
  const [totalPages, setTotalPages]= useState(1);
  const [loading, setLoading]      = useState(true);
  const [page, setPage]            = useState(1);
  const [query, setQuery]          = useState("");
  const [debouncedQ, setDebouncedQ]= useState("");
  const [category, setCategory]    = useState("all");
  const [status, setStatus]        = useState("all");

  const pageRef   = useRef(null);
  const headerRef = useRef(null);

  // Debounce Search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(query);
      setPage(1); 
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reset page on filter changes
  useEffect(() => { setPage(1); }, [category, status]);

  // Fetch Data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchProjects({ query: debouncedQ, page, perPage: PER_PAGE, category, status })
      .then(({ data, total, totalPages }) => {
        if (cancelled) return;
        setProjects(data);
        setTotal(total);
        setTotalPages(totalPages);
        setLoading(false);

        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

    return () => { cancelled = true; };
  }, [debouncedQ, page, category, status]);

  // Header Animation
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  return (
    <div className="min-h-screen pt-12 bg-gradient-to-br from-slate-50 via-cyan-50/20 to-pink-50/30 text-slate-900 font-['Space_Grotesk'] relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[45vw] h-[45vw] rounded-full bg-cyan-400/5 blur-[100px]" />
        <div className="absolute bottom-[5%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-pink-500/5 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 pt-12 pb-20">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">

          <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none mb-5 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            Built by the Community.
          </h1>

          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Explore the cutting-edge applications, XR environments, and full-stack systems developed by members of the RealXR team.
          </p>
        </div>

        {/* Filter & Search Panel */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl shadow-slate-200/20">
          <div className="flex justify-center mb-8">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-[0.68rem] font-bold tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers size={12} /> Domain
              </p>
              <FilterTabs options={PROJECT_CATEGORIES} active={category} onSelect={setCategory} accentColor="cyan" />
            </div>
            
            <div>
              <p className="text-[0.68rem] font-bold tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                <Activity size={12} /> Status
              </p>
              <FilterTabs options={PROJECT_STATUS} active={status} onSelect={setStatus} accentColor="pink" />
            </div>
          </div>
        </div>

        {/* Meta / Results count */}
        <div ref={pageRef} className="flex items-center justify-between mb-6 px-2">
          <p className="text-sm font-medium text-slate-500">
            {loading ? "Loading portfolio..." : (
              <>{total} project{total !== 1 ? "s" : ""} found <span className="text-slate-300 mx-2">|</span> Page {page} of {totalPages}</>
            )}
          </p>
          {!loading && (debouncedQ || category !== "all" || status !== "all") && (
            <button
              onClick={() => { setQuery(""); setCategory("all"); setStatus("all"); }}
              className="text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider"
            >
              Clear All Filters ✕
            </button>
          )}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
          ) : projects.length === 0 ? (
            <div className="text-center py-20 px-8 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200 border-dashed">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="font-['Syne'] text-2xl font-bold text-slate-800 mb-2">No projects match your criteria</h3>
              <p className="text-slate-500">Adjust your search terms or filter combinations to see more results.</p>
            </div>
          ) : (
            projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))
          )}
        </div>

        {/* Pagination Block */}
        {!loading && (
          <div className="mt-10">
             <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}

      </div>
    </div>
  );
}