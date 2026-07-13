// data/projectData.js

export const PROJECT_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "vr", label: "Virtual Reality" },
  { id: "ar", label: "Augmented Reality" },
  { id: "web", label: "Web Applications" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "systems", label: "Systems & Cloud" },
];

export const PROJECT_STATUS = [
  { id: "all", label: "All Statuses" },
  { id: "live", label: "Live / Completed" },
  { id: "beta", label: "In Beta" },
  { id: "development", label: "In Development" },
];

const mockProjects = [
  {
    id: "p1",
    title: "Anand Mela VR Arcade",
    excerpt: "An immersive VR gaming hub featuring custom cyber-punk environments, built for the college festival.",
    description: "Developed a centralized VR launcher and environment for the club's annual festival booth. Includes custom 3D assets, automated pricing/timer menus, and a spectator casting view to draw in crowds. Handled over 300+ concurrent players over the 3-day event.",
    category: "vr",
    status: "live",
    techStack: ["Unity", "C#", "Oculus SDK", "Blender"],
    teamSize: 5,
    date: "2026-02-15",
    githubUrl: "https://github.com/realxr/anand-mela-vr",
    liveUrl: "#",
    featured: true,
    thumbnailGradient: "from-cyan-500 to-blue-600"
  },
  {
    id: "p2",
    title: "Swapify",
    excerpt: "A seamless campus tiffin subscription and meal-swapping application.",
    description: "Full-stack application allowing students to manage their daily hostel tiffin subscriptions, swap meals with peers, and track nutrition. Features a custom 3D-inspired UI, seamless vector patterns, and a robust backend API for real-time menu updates.",
    category: "mobile",
    status: "beta",
    techStack: ["React Native", "Node.js", "Express", "MongoDB", "Figma"],
    teamSize: 3,
    date: "2026-01-10",
    githubUrl: "https://github.com/realxr/swapify-app",
    liveUrl: "https://swapify.app",
    featured: true,
    thumbnailGradient: "from-pink-500 to-rose-400"
  },
  {
    id: "p3",
    title: "OS CPU Scheduler Visualizer",
    excerpt: "Interactive web tool to visualize complex operating system CPU scheduling algorithms.",
    description: "Built to help computer science engineering students understand core OS architectures. Visualizes Round Robin, SJF, and Priority scheduling algorithms in real-time with adjustable parameters and animated gantt charts.",
    category: "web",
    status: "live",
    techStack: ["React", "Zustand", "Tailwind CSS", "D3.js"],
    teamSize: 2,
    date: "2026-04-05",
    githubUrl: "https://github.com/realxr/cpu-visualizer",
    liveUrl: "https://os-vis.realxr.dev",
    featured: false,
    thumbnailGradient: "from-purple-500 to-indigo-500"
  },
  {
    id: "p4",
    title: "XR Campus Navigator",
    excerpt: "Location-based AR application for wayfinding across the university campus.",
    description: "Maps out the entire campus using geospatial data and renders AR navigational arrows through the smartphone camera. Utilizes AWS edge locations for low-latency asset delivery and fast route calculation to specific labs and auditoriums.",
    category: "ar",
    status: "development",
    techStack: ["WebXR", "Three.js", "AWS CloudFront", "Python"],
    teamSize: 4,
    date: "2026-05-20",
    githubUrl: "https://github.com/realxr/campus-ar",
    liveUrl: "#",
    featured: true,
    thumbnailGradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "p5",
    title: "RealXR Club Portal",
    excerpt: "The main web portal for the club, featuring membership management, event RSVPs, and project showcases.",
    description: "A full-stack React application with a bespoke glassmorphic UI. Uses GSAP for high-performance animations and integrates a custom backend for tracking member contributions and club resources.",
    category: "web",
    status: "live",
    techStack: ["React", "GSAP", "Tailwind", "PostgreSQL"],
    teamSize: 6,
    date: "2025-11-30",
    githubUrl: "https://github.com/realxr/main-portal",
    liveUrl: "https://realxr.dev",
    featured: false,
    thumbnailGradient: "from-slate-700 to-slate-900"
  },
  {
    id: "p6",
    title: "HoloLab: Virtual Physics Sandbox",
    excerpt: "A VR simulation platform allowing engineering students to conduct dangerous or expensive physics experiments.",
    description: "Created as an open-source educational tool. Students can interact with electromagnetism setups, optics benches, and particle physics collisions in a safe, fully reactive VR physics engine without actual hardware constraints.",
    category: "vr",
    status: "beta",
    techStack: ["Unreal Engine 5", "C++", "OpenXR", "Niagara VFX"],
    teamSize: 4,
    date: "2026-03-12",
    githubUrl: "https://github.com/realxr/hololab-sandbox",
    liveUrl: "#",
    featured: true,
    thumbnailGradient: "from-amber-500 to-orange-600"
  },
  {
    id: "p7",
    title: "Aura: Interactive AR ID Cards",
    excerpt: "Brings college ID cards to life using custom image tracking technology.",
    description: "An AR application designed for orientation week. Pointing a smartphone camera at the official college student ID card overlays a responsive 3D avatar, direct links to student profiles, and real-time club recruitment updates.",
    category: "ar",
    status: "live",
    techStack: ["8th Wall", "A-Frame", "JavaScript", "Blender"],
    teamSize: 3,
    date: "2025-08-10",
    githubUrl: "https://github.com/realxr/aura-id-cards",
    liveUrl: "https://aura.realxr.dev",
    featured: false,
    thumbnailGradient: "from-fuchsia-600 to-pink-700"
  },
  {
    id: "p8",
    title: "RenderFarm Club Grid",
    excerpt: "Distributing idle lab computer resources to accelerate heavy 3D rendering tasks.",
    description: "A specialized cluster scheduling software deployed across the college computer science labs. Harnesses idle GPU capacities across 50+ machines at night to establish a high-speed distributed network for rendering heavy student animation files.",
    category: "systems",
    status: "live",
    techStack: ["Go", "Docker", "Redis", "gRPC", "Python"],
    teamSize: 5,
    date: "2026-05-02",
    githubUrl: "https://github.com/realxr/renderfarm-grid",
    liveUrl: "#",
    featured: false,
    thumbnailGradient: "from-red-500 to-darkred-700"
  },
  {
    id: "p9",
    title: "Spatial Audio Spatializer",
    excerpt: "Web-based tool optimizing custom ambisonic spatial soundscapes.",
    description: "A helper project created for our VR audio team. Enables sound design students to test, import, and visualize how multi-directional ambisonic sound fields bounce within simulated spaces using standard headphones.",
    category: "web",
    status: "development",
    techStack: ["React", "Web Audio API", "Three.js", "Vite"],
    teamSize: 2,
    date: "2026-06-18",
    githubUrl: "https://github.com/realxr/audio-spatializer",
    liveUrl: "#",
    featured: false,
    thumbnailGradient: "from-violet-600 to-purple-800"
  },
  {
    id: "p10",
    title: "Project Ghost: AR Museum Guide",
    excerpt: "Interactive historical tours overlaying lost campus landmarks onto current locations.",
    description: "Developed in partnership with the History department. Allows campus visitors to view detailed, historical 3D structural wireframes overlaying present-day ruins and landmarks through high-precision geolocation anchors.",
    category: "ar",
    status: "beta",
    techStack: ["Niantic Lightship", "Unity", "C#", "Firebase"],
    teamSize: 4,
    date: "2026-04-29",
    githubUrl: "https://github.com/realxr/project-ghost",
    liveUrl: "#",
    featured: false,
    thumbnailGradient: "from-lime-500 to-yellow-500"
  },
  {
    id: "p11",
    title: "NeuroVR: BCI Attention Tracker",
    excerpt: "Linking EEG brain-computer interfaces to adaptive VR gaming mechanics.",
    description: "An experimental research project utilizing openBCI hardware. The difficulty and visual speed of the custom Unity game adjust instantly in response to the user's focus levels and neurological data stream.",
    category: "vr",
    status: "development",
    techStack: ["Unity", "Python", "LSL", "Brainflow API", "C#"],
    teamSize: 3,
    date: "2026-07-01",
    githubUrl: "https://github.com/realxr/neuro-vr-tracker",
    liveUrl: "#",
    featured: false,
    thumbnailGradient: "from-teal-600 to-cyan-700"
  },
  {
    id: "p12",
    title: "Hostel Hub Tracker",
    excerpt: "IoT dashboard mapping realtime hub spaces and smart device usage.",
    description: "A centralized cross-platform mobile hub monitoring dynamic facility status across the campus hostels, including gym vacancies and pool tables, operating over a low-power mesh layout infrastructure.",
    category: "mobile",
    status: "live",
    techStack: ["Flutter", "Dart", "MQTT", "Raspberry Pi", "InfluxDB"],
    teamSize: 4,
    date: "2025-10-15",
    githubUrl: "https://github.com/realxr/hostel-hub",
    liveUrl: "https://hub.realxr.dev",
    featured: false,
    thumbnailGradient: "from-blue-700 to-indigo-900"
  }
];

export const fetchProjects = async ({ query = "", page = 1, perPage = 10, category = "all", status = "all" }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockProjects;

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.techStack.some(t => t.toLowerCase().includes(q))
        );
      }
      if (category !== "all") filtered = filtered.filter(p => p.category === category);
      if (status !== "all") filtered = filtered.filter(p => p.status === status);

      const total = filtered.length;
      const totalPages = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      const paginatedData = filtered.slice(start, start + perPage);

      resolve({ data: paginatedData, total, totalPages });
    }, 600); // simulated network delay
  });
};