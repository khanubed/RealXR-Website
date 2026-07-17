import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const linksRef = useRef([]);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Gallery", path: "/gallery" },
    { label: "Resources", path: "/resources" },
    { label: "Projects", path: "/projects" },
  ];

  // Modern useGSAP setup with scoping & dependency tracking
  useGSAP(
    () => {
      if (isOpen) {
        // Open overlay menu container smoothly
        gsap.to(menuRef.current, {
          clipPath: "circle(141.4% at 100% 0%)",
          duration: 0.6,
          ease: "power4.inOut",
        });
        // Stagger navigation link appearance
        gsap.fromTo(
          linksRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.15,
          },
        );
      } else {
        // Close overlay menu container cleanly
        gsap.to(menuRef.current, {
          clipPath: "circle(0% at 100% 0%)",
          duration: 0.5,
          ease: "power4.inOut",
        });
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  ); // Triggers cleanly on isOpen change

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* MAIN HEADERS / GLASS CONTAINER */}
      <nav
        className="flex z-50 items-center justify-between px-6 md:px-8 py-2 w-[calc(100%-2rem)] md:w-full mx-auto max-w-7xl 
                   bg-white/20 backdrop-blur-lg border-2 border-white/70 
                   rounded-2xl shadow-lg pointer-events-auto transition-all duration-300 relative"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className="font-bold text-xl tracking-tight text-gray-900 block"
        >
          <img
            src="/realXrLogo.PNG"
            className="drop-shadow-lg"
            alt="realXrLogo"
            width="90"
          />
        </Link>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex gap-8 text-gray-800 font-bold font-['Syne']">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`transition-colors hover:text-black py-1 ${
                location.pathname === item.path
                  ? "text-black border-b-2 border-black"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Join Us Button */}
        <Link
          to="/"
          className="hidden md:inline-block px-6 py-2 bg-black text-white rounded-full font-semibold font-['Syne']
                     hover:bg-gray-800 transition-all text-center"
        >
          Join Us
        </Link>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center gap-1.5 md:hidden w-10 h-10 rounded-xl bg-black/5 border border-white/40 active:scale-95 transition-transform z-[60]"
          aria-label="Toggle Menu"
          data-cursor-hover
        >
          <span
            className={`h-0.5 w-5 bg-gray-900 rounded-full transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-gray-900 rounded-full transition-opacity duration-200 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-gray-900 rounded-full transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* MOBILE FULLSCREEN OVERLAY MENU */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col justify-center items-center md:hidden z-[45]"
        style={{ clipPath: "circle(0% at 100% 0%)" }} // Keeps start/fallback state explicit without layout flash
      >
        <div className="flex flex-col items-center gap-8 text-center">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              ref={(el) => (linksRef.current[index] = el)}
              to={item.path}
              onClick={handleLinkClick}
              className={`text-3xl font-bold font-['Syne'] tracking-wide transition-colors ${
                location.pathname === item.path
                  ? "text-[#00F5D4]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            ref={(el) => (linksRef.current[menuItems.length] = el)}
            to="/"
            onClick={handleLinkClick}
            className="mt-4 px-8 py-3 bg-[#00F5D4] text-black rounded-full font-bold font-['Syne'] text-lg shadow-lg shadow-[#00F5D4]/20 active:scale-95 transition-transform"
          >
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
