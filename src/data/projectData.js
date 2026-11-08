import {
  ArGames,
  IESBuilding,
  LunarWalk,
  Maze,
  RealCarX,
  ScaryHouse,
  SquidGame,
  Virtomo,
} from "../assets/images/projects";

// Categories for filtering on the /projects catalog page
export const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "game", label: "Game Dev" },
  { id: "vr", label: "Virtual Reality" },
  { id: "ar", label: "Augmented Reality" },
  { id: "webxr", label: "WebXR" },
  { id: "mr", label: "Mixed Reality" },
  { id: "tool", label: "Tools & SDKs" },
];

// Project status indicators for badges and pulsing live indicators
export const STATUS = {
  live: { label: "Live", color: "#10b981" },
  prototype: { label: "Prototype", color: "#06b6d4" },
  rnd: { label: "R&D", color: "#ec4899" },
  archived: { label: "Archived", color: "#94a3b8" },
};

// Unified master projects list
export const PROJECTS = [
  {
    id: "realcarx",
    title: "RealCarX",
    tag: "Game",
    category: "game",
    status: "live",
    year: 2025,
    featured: true,
    img: RealCarX,
    image: RealCarX,
    tagline: "High-speed physics-driven automotive simulation with realistic vehicle dynamics",
    platform: "PC / Standalone",
    team: [
      { name: "Pushpraj Singh Jhala", role: "Physics & Gameplay" },
      { name: "Parag Malvi", role: "Environment & Audio" },
    ],
    stack: ["Unity", "C#", "Blender", "Wheel Colliders", "Shader Graph"],
    tags: ["physics", "vehicle-sim", "game-dev", "drift", "unity"],
    description:
      "An immersive driving simulation engine featuring accurate center-of-mass weight distribution, realistic suspension physics, and responsive drift mechanics engineered to test simulated vehicle behavior.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "where-is-the-lab",
    title: "Where Is The Lab",
    tag: "Game",
    category: "game",
    status: "live",
    year: 2025,
    featured: true,
    img: Maze,
    image: Maze,
    tagline: "Procedural 3D labyrinth puzzle testing spatial orientation and memory",
    platform: "PC / WebGL",
    team: [
      { name: "Aakif Makrani", role: "Level Generation" },
      { name: "Chandrashekhar Patel", role: "UI & Logic" },
    ],
    stack: ["Unity", "C#", "Procedural Generation", "NavMesh"],
    tags: ["maze", "puzzle", "spatial-awareness", "procedural", "unity"],
    description:
      "A 3D spatial maze puzzle challenge where players navigate dynamic corridors, decipher visual clues, and solve navigational puzzles to locate the hidden research lab.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "scary-house",
    title: "Scary House",
    tag: "Game",
    category: "game",
    status: "prototype",
    year: 2024,
    featured: true,
    img: ScaryHouse,
    image: ScaryHouse,
    tagline: "Atmospheric first-person horror experience with dynamic spatial lighting and audio",
    platform: "PC / Standalone",
    team: [
      { name: "Sourabh Prajapat", role: "Lighting & Audio" },
      { name: "Sara Thakur", role: "Level Design" },
    ],
    stack: ["Unreal Engine", "Blueprints", "Spatial Audio", "Lumen"],
    tags: ["horror", "atmospheric", "lighting", "unreal-engine", "binaural"],
    description:
      "An interactive psychological horror prototype focusing on binaural 3D audio cues, claustrophobic architectural design, and dynamic shadow rendering to create spatial tension.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "lunar-walk",
    title: "Lunar Walk",
    tag: "VR Game",
    category: "vr",
    status: "live",
    year: 2025,
    featured: true,
    img: LunarWalk,
    image: LunarWalk,
    tagline: "Low-gravity VR moon exploration simulation with physics-based locomotion",
    platform: "Meta Quest 3 · OpenXR",
    team: [
      { name: "Hiteshi Vishwakarma", role: "VR Developer" },
      { name: "Mahendra Nayak", role: "3D Environments" },
    ],
    stack: ["Unity", "OpenXR", "C#", "Blender", "XR Interaction Toolkit"],
    tags: ["vr", "lunar", "gravity-sim", "quest3", "openxr"],
    description:
      "Puts players in the boots of an astronaut traversing the lunar surface, featuring simulated 1/6th Earth gravity, interactive scientific equipment, and panoramic celestial views.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "squid-game",
    title: "Squid Game",
    tag: "VR Game",
    category: "vr",
    status: "prototype",
    year: 2024,
    featured: true,
    img: SquidGame,
    image: SquidGame,
    tagline: "High-stakes motion-tracked survival VR mini-games based on precision timing",
    platform: "Meta Quest 2 / 3",
    team: [
      { name: "Naina Seth", role: "VR Mechanics" },
      { name: "Tanushri Solanki", role: "Interaction Design" },
    ],
    stack: ["Unity", "XR Interaction Toolkit", "C#", "6-DOF Tracking"],
    tags: ["vr", "mini-games", "motion-tracking", "survival", "quest"],
    description:
      "Recreates popular precision-timing survival challenges in full 6-DOF virtual reality, requiring players to physically freeze and manage their head and hand movements in real time.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "360-ies-building",
    title: "360° IES Building",
    tag: "VR Project",
    category: "vr",
    status: "live",
    year: 2025,
    featured: true,
    img: IESBuilding,
    image: IESBuilding,
    tagline: "Immersive 360-degree virtual tour and spatial exploration of the IES IPS Academy campus",
    platform: "WebXR / Meta Quest",
    team: [
      { name: "Ubed Khan", role: "WebXR Developer" },
      { name: "Ashika Jain", role: "Photogrammetry & Media" },
    ],
    stack: ["WebXR", "Three.js", "React Three Fiber", "Equirectangular Panoramas"],
    tags: ["virtual-tour", "360-photo", "campus", "webxr", "threejs"],
    description:
      "A comprehensive 360-degree virtual reality walkthrough of the Institute of Engineering and Science facilities, allowing prospective students to explore classrooms, research labs, and workshops remotely.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "virtomo",
    title: "Virtomo",
    tag: "VR Project",
    category: "vr",
    status: "prototype",
    year: 2026,
    featured: true,
    img: Virtomo,
    image: Virtomo,
    tagline: "Interactive spatial laboratory for engineering simulations and molecular modeling",
    platform: "Meta Quest 3 · Hand Tracking",
    team: [
      { name: "Pushpraj Singh Jhala", role: "XR Architect" },
      { name: "Hiteshi Vishwakarma", role: "Hand Physics" },
    ],
    stack: ["Unity", "Meta XR Core SDK", "Hand Tracking API", "C#"],
    tags: ["spatial-lab", "hand-tracking", "simulation", "molecular", "quest3"],
    description:
      "A virtual workspace where users manipulate complex spatial objects, mechanical assemblies, and engineering models using natural controller-free hand gestures.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "ar-games",
    title: "AR Games",
    tag: "AR Game",
    category: "ar",
    status: "live",
    year: 2025,
    featured: true,
    img: ArGames,
    image: ArGames,
    tagline: "Suite of interactive augmented reality tabletop games and surface trackers",
    platform: "Android / iOS · ARCore",
    team: [
      { name: "Ubed Khan", role: "Mobile AR Dev" },
      { name: "Naina Seth", role: "Game Design" },
    ],
    stack: ["Unity", "AR Foundation", "ARCore", "Plane Detection", "C#"],
    tags: ["augmented-reality", "plane-detection", "mobile-ar", "tabletop"],
    description:
      "A collection of quick-play augmented reality games utilizing real-time plane detection, physics collisions with real-world physical surfaces, and touch gestures.",
    links: { live: "#", github: "#", demo: "#" },
  },
];

// Unified home data contract:
// Pre-filtered static array of featured projects ensures stable reference
// and prevents GSAP ScrollTrigger teardown loops on re-renders.
const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured !== false);

export const projectsData = {
  marqueeText: "RECENT PROJECTS — ",
  projects: FEATURED_PROJECTS,
};
