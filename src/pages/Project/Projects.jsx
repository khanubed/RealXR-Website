import React, { useState, useMemo, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Aperture, ArrowUpRight } from "lucide-react";
import { PROJECTS, CATEGORIES } from "../../data/projectsPageData";
import { getProjectsPageData } from "../../api/api";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterTabs } from "../../components/ui/FilterTabs";
import { FeaturedSpotlight } from "./components/FeaturedSpotlight";
import { ProjectCard } from "./components/ProjectCard";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [projects, setProjects] = useState(PROJECTS);
  const headerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getProjectsPageData().then((list) => {
      if (!cancelled && list?.length) setProjects(list);
    });
    return () => { cancelled = true; };
  }, []);

  const featured = useMemo(() => projects.find((project) => project.featured), [projects]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => (category === "all" || project.category === category) && (!term || project.title.toLowerCase().includes(term) || project.tagline.toLowerCase().includes(term) || project.stack.some((item) => item.toLowerCase().includes(term)) || project.tags.some((item) => item.toLowerCase().includes(term))));
  }, [query, category, projects]);
  useGSAP(() => { const items = headerRef.current?.querySelectorAll("[data-reveal]"); if (items?.length) gsap.fromTo(items, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .85, stagger: .09, ease: "expo.out" }); }, { scope: headerRef });

  return (
    <div className="min-h-screen pt-10 text-[#15141a] relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-[65vw] h-[45rem] bg-[radial-gradient(ellipse,rgba(255,61,143,.13),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-12 pb-24">
        <header ref={headerRef} className="pt-16 sm:pt-24 pb-11 border-b border-[#15141a]/10 grid lg:grid-cols-[1fr_330px] gap-8">
          <div><p data-reveal className="flex items-center gap-3 mb-5 text-[.68rem] uppercase tracking-[.24em] font-semibold text-[#ff3d8f]"><span className="w-8 h-px bg-current" />Field log / 02</p><h1 data-reveal className="font-['Syne'] font-extrabold text-[clamp(3.3rem,8vw,7.6rem)] tracking-[-.075em] leading-[.83]">WORK<br />IN <span className="text-[#00bfae]">MOTION.</span></h1></div>
          <div data-reveal className="lg:self-end lg:border-l lg:border-[#15141a]/10 lg:pl-6 text-[#15141a]/60 leading-relaxed">Experiments, prototypes and experiences built at the intersection of people, pixels and physical space.<span className="block mt-5 font-mono text-[.66rem] tracking-[.14em] text-[#15141a]/40">SELECTED WORK / 2026</span></div>
        </header>
        {featured && <section className="py-10 border-b border-[#15141a]/10"><FeaturedSpotlight project={featured} /></section>}
        <section className="grid lg:grid-cols-[190px_minmax(0,1fr)] border-b border-[#15141a]/10"><div className="py-6 lg:py-8 text-[.66rem] font-mono tracking-[.14em] uppercase text-[#15141a]/45">Explore / filter</div><div className="py-5 lg:py-7 lg:border-l border-[#15141a]/10"><div className="max-w-2xl"><SearchBar value={query} onChange={setQuery} /></div><div className="mt-5 pt-5 border-t border-[#15141a]/8"><p className="mb-2 text-[.62rem] tracking-[.16em] uppercase font-semibold text-[#15141a]/40">Practice</p><FilterTabs options={CATEGORIES} active={category} onSelect={setCategory} accentColor="cyan" /></div></div></section>
        <section className="grid lg:grid-cols-[190px_minmax(0,1fr)]"><div className="pt-7 lg:pt-10 font-mono text-[.66rem] tracking-[.14em] uppercase text-[#15141a]/45">{String(filtered.length).padStart(2, "0")} projects</div><div className="lg:border-l border-[#15141a]/10 lg:pl-8 py-7 lg:py-10"><div className="flex justify-between mb-5 pb-4 border-b border-[#15141a]/10 text-sm text-[#15141a]/55"><span>Selected studies / ongoing archive</span>{(query || category !== "all") && <button onClick={() => { setQuery(""); setCategory("all"); }} className="flex items-center gap-1 text-[#ff3d8f] text-xs font-semibold hover:gap-2 transition-all">Reset view <ArrowUpRight size={13} /></button>}</div>{filtered.length === 0 ? <div className="py-20 border-y border-[#15141a]/10"><Aperture className="text-[#00bfae] mb-4" /><h3 className="font-['Syne'] text-3xl font-bold">Nothing in frame.</h3><p className="mt-2 text-[#15141a]/55">Try a different search or reset the view.</p></div> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#15141a]/10 border border-[#15141a]/10">{filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>}</div></section>
        <footer className="border-t border-[#15141a]/10 pt-6 mt-6 flex flex-col sm:flex-row justify-between gap-3 text-[.68rem] font-mono tracking-[.1em] uppercase text-[#15141a]/45"><span>RealXR / IES IPS Academy</span><a href="mailto:realxr@iesipsacademy.ac.in" className="hover:text-[#ff3d8f]">Pitch a project ↗</a></footer>
      </div>
    </div>
  );
}
