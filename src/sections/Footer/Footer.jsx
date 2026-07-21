import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const blackWrapRef = useRef(null);

  const navigateLinks = [
    { name: "Club Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Our Domains", href: "#" },
    { name: "Projects", href: "#" },
    { name: "Events", href: "#" },
    { name: "Join Us", href: "#" },
  ];

  const domainLinks = [
    { name: "AR Development", href: "#" },
    { name: "VR Development", href: "#" },
    { name: "Game Development", href: "#" },
    { name: "3D Modelling", href: "#" },
    { name: "Web Development", href: "#" },
  ];

  const resourceLinks = [
    { name: "Brand Assets", href: "#" },
    { name: "Hardware Inventory", href: "#" },
    { name: "Code of Conduct", href: "#" },
    { name: "Lab Wiki & Docs", href: "#" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "#", dynamicId: "@realxr.ipsa" },
    { name: "LinkedIn", href: "#", dynamicId: "RealXR Club" },
    { name: "GitHub", href: "#", dynamicId: "realxr-org" },
    { name: "Discord", href: "#", dynamicId: "Join Server" },
  ];

  useGSAP(
    () => {
      // Natural cloth-feel visual entry speed adjust offset
      gsap.fromTo(
        blackWrapRef.current,
        { yPercent: 6 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: blackWrapRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        },
      );

      // Link grid list presentation fade staging
      gsap.fromTo(
        gsap.utils.toArray(".reveal-item"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: blackWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      ScrollTrigger.refresh();
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="w-full z-50 flex flex-col bg-black text-white select-none"
    >
      <div
        ref={blackWrapRef}
        className="w-full rounded-t-[2.5rem] md:rounded-t-[4rem] overflow-hidden shadow-[0_-60px_100px_-20px_rgba(0,0,0,0.65)] bg-black"
      >
        <div className="w-full bg-black px-6 pt-16 pb-8 md:px-16 md:pt-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Logo & Info Column */}
          <div className="reveal-item md:col-span-4 lg:col-span-4 flex flex-col space-y-6">
            <div className="relative w-44 h-auto opacity-90 hover:opacity-100 transition-opacity">
              <img src="/realXr.PNG" alt="RealXR logo" />
            </div>

            <div className="space-y-1">
              <p className="orbitron-600 text-xs tracking-wider uppercase text-zinc-300">
                Spatial Computing Lab
              </p>
              <p className="orbitron-400 text-[11px] text-zinc-500 leading-relaxed">
                Room 402, Knowledge Center Block
                <br />
                IES IPS Academy Campus, Indore (M.P.)
              </p>
            </div>

            <div className="space-y-1">
              <p className="orbitron-600 text-xs tracking-wider uppercase text-zinc-300">
                Inquiries
              </p>
              <a
                href="mailto:realxr@ipsacademy.org"
                className="orbitron-400 text-[11px] text-[#00F5D4] hover:underline"
              >
                realxr@ipsacademy.org
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            <div className="reveal-item flex flex-col space-y-4">
              <h4 className="orbitron-700 text-xs md:text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Navigate
              </h4>
              <ul className="flex flex-col space-y-2">
                {navigateLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="orbitron-400 text-xs text-zinc-400 hover:text-[#00F5D4] transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-item flex flex-col space-y-4">
              <h4 className="orbitron-700 text-xs md:text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Domains
              </h4>
              <ul className="flex flex-col space-y-2">
                {domainLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="orbitron-400 text-xs text-zinc-400 hover:text-[#00F5D4] transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-item flex flex-col space-y-4 col-span-2 sm:col-span-1">
              <h4 className="orbitron-700 text-xs md:text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Ecosystem
              </h4>
              <ul className="flex flex-col space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="orbitron-400 text-xs text-zinc-400 hover:text-[#00F5D4] transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-1 md:col-span-12 border-t border-white/[0.08] my-4" />

          {/* Social Links */}
          <div className="reveal-item col-span-1 md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-[#00F5D4]/30 transition-all duration-300 group"
              >
                <span className="orbitron-700 text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                  {social.name}
                </span>
                <span className="orbitron-400 text-xs text-zinc-300 mt-1 font-mono tracking-tight group-hover:text-[#00F5D4] transition-colors">
                  {social.dynamicId}
                </span>
              </a>
            ))}
          </div>

          {/* Credits footer panel */}
          <div className="reveal-item col-span-1 md:col-span-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-600 mt-4 border-t border-white/[0.05] pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>© 2026 REALXR CLUB. ALL CORE SYSTEMS OPERATIONAL.</span>
              <span className="hidden sm:inline text-zinc-800">|</span>
              <span>
                DESIGNED & ANIMATED BY{" "}
                <a
                  href="https://instagram.com/your_handle_here"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-[#00F5D4] tracking-wider transition-colors duration-200 font-bold underline decoration-zinc-700 hover:decoration-[#00F5D4]"
                >
                  UBED KHAN
                </a>
              </span>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="hover:text-zinc-400 transition-colors">
                PRIVACY MODEL
              </a>
              <a href="#" className="hover:text-zinc-400 transition-colors">
                TERMS OF TRANSMISSION
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="w-full bg-white text-black pt-8 pb-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full flex whitespace-nowrap overflow-hidden group select-none">
            <div className="flex flex-row space-x-8 animate-marquee inline-block py-2">
              <span className="syne-800 text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter shrink-0 mx-4">
                RealXR IPSA — RealXR IPSA — RealXR IPSA — RealXR IPSA
              </span>
            </div>
            <div
              className="flex flex-row space-x-8 animate-marquee inline-block py-2"
              aria-hidden="true"
            >
              <span className="syne-800 text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter shrink-0 mx-4">
                RealXR IPSA — RealXR IPSA — RealXR IPSA — RealXR IPSA
              </span>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `,
        }}
      />
    </footer>
  );
}