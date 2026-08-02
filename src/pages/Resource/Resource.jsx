import React, { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Search, ArrowUpRight } from "lucide-react";
import { fetchResources, CATEGORIES, RESOURCE_TYPES } from "../../data/resourceData";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterTabs } from "../../components/ui/FilterTabs";
import { Pagination } from "../../components/ui/Pagination";
import { ResourceCard } from "./components/ResourceCard";
import { SkeletonCard } from "../../components/ui/SkeletonCard";

const PER_PAGE = 10;

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [category, setCategory] = useState("all");
  const [resType, setResType] = useState("all");
  const pageRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedQ(query); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => { setPage(1); }, [category, resType]);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchResources({ query: debouncedQ, page, perPage: PER_PAGE, category, type: resType }).then((result) => {
      if (cancelled) return;
      setResources(result.data); setTotal(result.total); setTotalPages(result.totalPages); setLoading(false);
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => { cancelled = true; };
  }, [debouncedQ, page, category, resType]);

  useGSAP(() => {
    const elements = headerRef.current?.querySelectorAll("[data-reveal]");
    if (elements?.length) gsap.fromTo(elements, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" });
  }, { scope: headerRef });

  const typeOptions = useMemo(() => [{ id: "all", label: "All Types" }, ...Object.entries(RESOURCE_TYPES).map(([id, { label }]) => ({ id, label }))], []);
  const filtered = debouncedQ || category !== "all" || resType !== "all";

  return (
    <div className="min-h-screen pt-10 text-[#15141a] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_80%_0%,rgba(0,191,174,.13),transparent_50%),radial-gradient(ellipse_at_12%_15%,rgba(255,61,143,.12),transparent_42%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-12 pb-24">
        <header ref={headerRef} className="grid lg:grid-cols-[minmax(0,1fr)_290px] gap-8 lg:gap-16 pt-16 sm:pt-24 pb-10 border-b border-[#15141a]/10">
          <div>
            <p data-reveal className="flex items-center gap-3 text-[.68rem] tracking-[.24em] uppercase font-semibold text-[#00a99a] mb-5"><span className="w-8 h-px bg-current" />Signal library / 01</p>
            <h1 data-reveal className="font-['Syne'] font-extrabold text-[clamp(3.4rem,8vw,8rem)] leading-[.82] tracking-[-.07em]">MAKE<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d8f] to-[#00bfae]">REALITY.</span></h1>
          </div>
          <div data-reveal className="lg:self-end lg:border-l lg:border-[#15141a]/10 lg:pl-6 text-sm leading-relaxed text-[#15141a]/60">
            A working index of references, research and tools for people building beyond the flat screen.
            <span className="block mt-5 font-mono text-[.66rem] tracking-[.14em] text-[#15141a]/40">CURATED / REALXR / 2026</span>
          </div>
        </header>

        <section className="grid lg:grid-cols-[190px_minmax(0,1fr)] border-b border-[#15141a]/10">
          <div className="py-6 lg:py-8 text-[.66rem] font-mono tracking-[.14em] text-[#15141a]/45 uppercase">Discover / filter</div>
          <div className="py-5 lg:py-7 lg:border-l border-[#15141a]/10">
            <div className="max-w-2xl"><SearchBar value={query} onChange={setQuery} /></div>
            <div className="grid md:grid-cols-2 gap-5 mt-6 pt-5 border-t border-[#15141a]/8">
              <div><p className="mb-2 text-[.62rem] tracking-[.16em] uppercase font-semibold text-[#15141a]/40">Discipline</p><FilterTabs options={CATEGORIES} active={category} onSelect={setCategory} accentColor="cyan" /></div>
              <div><p className="mb-2 text-[.62rem] tracking-[.16em] uppercase font-semibold text-[#15141a]/40">Format</p><FilterTabs options={typeOptions} active={resType} onSelect={setResType} accentColor="pink" /></div>
            </div>
          </div>
        </section>

        <section ref={pageRef} className="grid lg:grid-cols-[190px_minmax(0,1fr)]">
          <div className="pt-7 lg:pt-10 font-mono text-[.66rem] tracking-[.14em] uppercase text-[#15141a]/45">{loading ? "Indexing..." : `${String(total).padStart(2, "0")} entries`}</div>
          <div className="lg:border-l border-[#15141a]/10 lg:pl-8 py-7 lg:py-10">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#15141a]/10 text-sm text-[#15141a]/55"><span>Page {page} / {totalPages}</span>{filtered && <button onClick={() => { setQuery(""); setCategory("all"); setResType("all"); }} className="flex items-center gap-1 text-[#ff3d8f] text-xs font-semibold hover:gap-2 transition-all">Reset index <ArrowUpRight size={13} /></button>}</div>
            <div className="flex flex-col gap-3">
              {loading ? Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />) : resources.length === 0 ? <div className="py-20 border-y border-[#15141a]/10"><Search className="mb-4 text-[#00bfae]" /><h3 className="font-['Syne'] text-3xl font-bold">No signal found.</h3><p className="mt-2 text-[#15141a]/55">Try another term or reset the index.</p></div> : resources.map((item, i) => <ResourceCard key={item.id} item={item} index={i} />)}
            </div>
            {!loading && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
          </div>
        </section>
        <footer className="border-t border-[#15141a]/10 pt-6 mt-6 flex flex-col sm:flex-row justify-between gap-3 text-[.68rem] font-mono tracking-[.1em] uppercase text-[#15141a]/45"><span>RealXR / IES IPS Academy</span><a href="mailto:realxr@iesipsacademy.ac.in" className="hover:text-[#00a99a]">Suggest a resource ↗</a></footer>
      </div>
    </div>
  );
}
