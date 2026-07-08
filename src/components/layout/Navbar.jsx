import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    /* backdrop-blur-lg: Creates the frosted glass effect
       bg-white/20: Semi-transparent white background
       border-white/30: Subtle border for glass edge
    */ 
      <nav
        className="flex z-50 items-center w-full justify-between px-8 py-2 mx-auto max-w-7xl 
                      bg-white/20 backdrop-blur-lg border-2 border-white/70 
                      rounded-2xl shadow-lg pointer-events-auto"
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-bold orbitron-700 text-xl tracking-tight text-gray-900 block"
        >
          <img
            src="/public/realXrLogo.PNG"
            className="drop-shadow-lg"
            alt="realXrLogo"
            width="100px"
          />
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex gap-8 text-gray-800 syne-700">
          {[
            { label: "Home", path: "/" },
            { label: "Gallery", path: "/gallery" },
            { label: "Events", path: "/events" },
            { label: "Blogs", path: "/blogs" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Join Us Button */}
        <Link
          to="/"
          className="px-6 py-2 bg-black text-white rounded-full font-semibold syne-700
                         hover:bg-gray-800 transition-all text-center inline-block"
        >
          Join Us
        </Link>
      </nav>
  );
};

export default Navbar;
