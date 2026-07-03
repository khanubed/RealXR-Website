import React from 'react'

const Navbar = () => {
  return (
    //       {/* backdrop-blur-lg: Creates the frosted glass effect
    //       bg-white/20: Semi-transparent white background
    //       border-white/30: Subtle border for glass edge
    //   */}
      <div className="absolute top-6 left-5 right-5 z-10 ">
        <nav
          className="flex items-center  justify-between px-8 py-2 mx-auto max-w-7xl 
                        bg-white/20 backdrop-blur-lg border-2 border-white/70 
                        rounded-2xl shadow-lg"
        >
          {/* Logo */}
          <div className="font-bold orbitron-700 text-xl tracking-tight text-gray-900">
            RealXR
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex gap-8 text-gray-800 syne-700">
            {["Home", "About", "Projects", "Events", "Team"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-black transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Join Us Button */}
          <button
            className="px-6 py-2 bg-black text-white rounded-full font-semibold syne-700
                           hover:bg-gray-800 transition-all"
          >
            Join Us
          </button>
        </nav>
      </div>
  )
}

export default Navbar