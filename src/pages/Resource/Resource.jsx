import React, { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { Search } from "lucide-react";
import { fetchResources, CATEGORIES, RESOURCE_TYPES } from "../../data/resourceData";

// Components
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterTabs } from "../../components/ui/FilterTabs";
import { Pagination } from "../../components/ui/Pagination";
import { ResourceCard } from "./components/ResourceCard";
import { SkeletonCard } from "../../components/ui/SkeletonCard";

const PER_PAGE = 10;

export default function Resources() {
  const [resources, setResources]  = useState([]);
  const [total, setTotal]          = useState(0);
  const [totalPages, setTotalPages]= useState(1);
  const [loading, setLoading]      = useState(true);
  const [page, setPage]            = useState(1);
  const [query, setQuery]          = useState("");
  const [debouncedQ, setDebouncedQ]= useState("");
  const [category, setCategory]    = useState("all");
  const [resType, setResType]      = useState("all");

  const pageRef    = useRef(null);
  const headerRef  = useRef(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(query);
      setPage(1); 
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [category, resType]);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchResources({ query: debouncedQ, page, perPage: PER_PAGE, category, type: resType })
      .then(({ data, total, totalPages }) => {
        if (cancelled) return;
        setResources(data);
        setTotal(total);
        setTotalPages(totalPages);
        setLoading(false);

        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

    return () => { cancelled = true; };
  }, [debouncedQ, page, category, resType]);

  // Header entrance animation
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  const typeOptions = useMemo(() => [
    { id: "all", label: "All Types" },
    ...Object.entries(RESOURCE_TYPES).map(([id, { label }]) => ({ id, label })),
  ], []);

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-pink-50 via-cyan-50/30 to-white text-slate-900 space-400 relative overflow-hidden">
      
      {/* Decorative Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-cyan-400/10 blur-[80px]" />
        <div className="absolute bottom-[10%] -left-[8%] w-[50vw] h-[50vw] rounded-full bg-pink-500/5 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 pt-12 pb-20">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[0.7rem] tracking-widest uppercase text-cyan-600 font-bold">
              RealXR Resource Library
            </span>
          </div>

          <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none mb-4 bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Learn. Build. Ship.
          </h1>

          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            Curated XR development resources — tutorials, papers, tools, and courses 
            handpicked by the RealXR community.
          </p>
        </div>

        {/* Search & Filters Container */}
        <div className="bg-white/60 backdrop-blur-xl border border-pink-500/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_4px_24px_rgba(6,182,212,0.06),0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex justify-center mb-6">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[0.68rem] font-bold tracking-widest uppercase text-slate-400 mb-2.5">
                Category
              </p>
              <FilterTabs 
                options={CATEGORIES} 
                active={category} 
                onSelect={setCategory} 
                accentColor="cyan" 
              />
            </div>
            
            <div>
              <p className="text-[0.68rem] font-bold tracking-widest uppercase text-slate-400 mb-2.5">
                Type
              </p>
              <FilterTabs 
                options={typeOptions} 
                active={resType} 
                onSelect={setResType} 
                accentColor="pink" 
              />
            </div>
          </div>
        </div>

        {/* Results Info & Action */}
        <div ref={pageRef} className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm font-medium text-slate-500">
            {loading ? "Searching resources..." : (
              <>{total} resource{total !== 1 ? "s" : ""} found <span className="text-slate-300 mx-1">•</span> Page {page} of {totalPages}</>
            )}
          </p>
          {!loading && (debouncedQ || category !== "all" || resType !== "all") && (
            <button
              onClick={() => { setQuery(""); setCategory("all"); setResType("all"); }}
              className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Resource List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
          ) : resources.length === 0 ? (
            <div className="text-center py-16 px-8 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-900/5">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-['Syne'] text-xl font-bold text-slate-800 mb-2">No resources found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your search terms or clearing your filters to see more results.</p>
            </div>
          ) : (
            resources.map((item, i) => (
              <ResourceCard key={item.id} item={item} index={i} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}

        {/* Footer */}
        <footer className="text-center mt-16 text-xs text-slate-400 font-medium leading-loose">
          Curated by the RealXR Web Dev Team • IES IPS Academy, Indore<br />
          <a href="mailto:realxr@iesipsacademy.ac.in" className="text-cyan-600 hover:text-pink-500 transition-colors group">
            Suggest a resource <span className="inline-block transition-transform group-hover:translate-x-1">→</span> realxr@iesipsacademy.ac.in
          </a>
        </footer>

      </div>
    </div>
  );
}