// src/data/projectsData.js
// Mirrors the shape of resourceData.js (CATEGORIES export pattern) so the
// existing SearchBar / FilterTabs components work without modification.

export const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ar", label: "Augmented Reality" },
  { id: "vr", label: "Virtual Reality" },
  { id: "mr", label: "Mixed Reality" },
  { id: "webxr", label: "WebXR" },
  { id: "game", label: "Game Dev" },
  { id: "tool", label: "Tools & SDKs" },
];

// Real signal, not decoration — this drives the badge colour + the pulsing
// "LIVE" dot on cards, so it needs to say something true about the project.
export const STATUS = {
  live: { label: "Live", color: "#10b981" },
  prototype: { label: "Prototype", color: "#06b6d4" },
  rnd: { label: "R&D", color: "#ec4899" },
  archived: { label: "Archived", color: "#94a3b8" },
};

export const PROJECTS = [
  {
    id: "p1",
    title: "NeuroLens",
    tagline: "Hand-tracked AR anatomy viewer built for lecture halls",
    category: "ar",
    status: "live",
    year: 2026,
    featured: true,
    platform: "Android / iOS · ARCore",
    team: [
      { name: "Ubed Khan", role: "Lead Dev" },
      { name: "Ansh Rathore", role: "3D Artist" },
      { name: "Priya Solanki", role: "UX" },
    ],
    stack: ["Unity", "AR Foundation", "C#", "Blender"],
    tags: ["handtracking", "education", "arcore"],
    description:
      "A markerless AR viewer that lets students pinch, rotate and peel back layered 3D organ models mid-lecture. Runs entirely on-device with hand tracking, no headset required — just a phone camera pointed at a desk.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "p2",
    title: "Aether VR",
    tagline: "A physically-based VR meditation space with true hand presence",
    category: "vr",
    status: "prototype",
    year: 2025,
    platform: "Meta Quest 3",
    team: [
      { name: "Devansh Patil", role: "Lead Dev" },
      { name: "Riya Chouhan", role: "Sound Design" },
    ],
    stack: ["Unreal Engine", "OpenXR", "Blueprints"],
    tags: ["comfort", "audio-reactive", "handtracking"],
    description:
      "An exploration of locomotion-free VR — the whole experience is seated, breath-paced, and driven by hand presence instead of controllers. Built to test motion-comfort guidelines for first-time VR users.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "p3",
    title: "CampusXR Twin",
    tagline: "A walkable WebXR digital twin of the IES IPS Academy campus",
    category: "webxr",
    status: "live",
    year: 2026,
    platform: "Browser · WebXR",
    team: [
      { name: "Ubed Khan", role: "Web Dev Lead" },
      { name: "Simran Verma", role: "3D Pipeline" },
    ],
    stack: ["React Three Fiber", "Three.js", "Blender", "Draco"],
    tags: ["webxr", "photogrammetry", "campus"],
    description:
      "Photogrammetry-scanned campus blocks, optimised down to a browser-friendly draw count, navigable on desktop, mobile, or a headset via WebXR — built as the front door for prospective students.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "p4",
    title: "Holotable",
    tagline: "A passthrough MR tabletop wargame for two players",
    category: "mr",
    status: "rnd",
    year: 2026,
    platform: "Meta Quest 3 · Passthrough",
    team: [
      { name: "Kabir Solanki", role: "Gameplay" },
      { name: "Ansh Rathore", role: "3D Artist" },
    ],
    stack: ["Unity", "Meta MR Utility Kit", "Netcode"],
    tags: ["passthrough", "multiplayer", "roomscale"],
    description:
      "Uses room mesh data to snap a miniature battlefield onto any real table, with two headsets synced over local network so both players see the same units from their own side.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "p5",
    title: "Riftrunner",
    tagline: "A physics platformer built to test VR locomotion comfort",
    category: "game",
    status: "prototype",
    year: 2025,
    platform: "Meta Quest 3",
    team: [
      { name: "Devansh Patil", role: "Lead Dev" },
      { name: "Riya Chouhan", role: "Level Design" },
    ],
    stack: ["Unreal Engine", "Chaos Physics", "OpenXR"],
    tags: ["locomotion", "physics", "playtested"],
    description:
      "A short platforming gauntlet used internally to A/B test snap-turn vs smooth-turn and teleport vs joystick locomotion, with in-headset comfort surveys after every run.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "p6",
    title: "SpatialKit",
    tagline: "An internal SDK for rapid AR prototyping in React",
    category: "tool",
    status: "live",
    year: 2025,
    platform: "npm package",
    team: [
      { name: "Ubed Khan", role: "Maintainer" },
      { name: "Simran Verma", role: "Contributor" },
    ],
    stack: ["React Three Fiber", "TypeScript", "WebXR API"],
    tags: ["sdk", "opensource", "r3f"],
    description:
      "Hooks and primitives the club reuses across every new WebXR project — hit-testing, anchor persistence, and a debug HUD — so a new AR prototype takes an afternoon instead of a week.",
    links: { live: "#", github: "#", demo: "#" },
  },
  {
    id: "p7",
    title: "Ghosts of Rampal Bagh",
    tagline:
      "A location-based AR heritage trail through a historic site in Indore",
    category: "ar",
    status: "archived",
    year: 2024,
    platform: "Android · GPS + ARCore",
    team: [
      { name: "Kabir Solanki", role: "Lead Dev" },
      { name: "Priya Solanki", role: "Research" },
    ],
    stack: ["Unity", "ARCore Geospatial", "Firebase"],
    tags: ["geospatial", "heritage", "archived"],
    description:
      "GPS-anchored AR reconstructions of the site as it stood a century ago, unlocked as visitors walk between checkpoints. The club's first field deployment — since retired after the event.",
    links: { live: "#", github: "#", demo: "#" },
  },
];
