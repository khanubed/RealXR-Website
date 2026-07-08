/**
 * GalleryData.js
 * ─────────────────────────────────────────────────────────────────
 * Mock data contract designed to mirror a real REST/GraphQL payload.
 * Schema: Event[] → MediaItem[]
 *
 * When migrating to a backend, replace this file's exports with
 * async fetch() calls — zero other changes needed in the UI layer.
 * ─────────────────────────────────────────────────────────────────
 */

// Unsplash images used as placeholders — swap with real CDN URLs
const PH = (id, w = 800, h = 600) =>
  `https://picsum.photos/seed/${id}/${w}/${h}`;

// ── Media item shape ───────────────────────────────────────────────
// id          : unique string (used as URL param for deep-linking)
// type        : "image" | "video"
// src         : full-quality URL
// thumb       : low-res thumbnail (shown before lazy load / as video poster)
// width/height: intrinsic px — used to compute aspect ratio before load (prevents CLS)
// span        : grid column span hint — "1" | "2" | "tall"
// caption     : alt text / lightbox description
// videoMp4    : (video only) direct MP4 source

export const EVENTS = [
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hackathon-3",
    slug: "hackathon-3",
    title: "RealXR Hackathon 3.0",
    date: "Aug 2025",
    location: "Main Auditorium",
    coverThumb: PH("hack3cover", 800, 500),
    accent: "#00F5D4",
    tagline: "24 hrs · 80 builders · 1 theme",
    description:
      "Our biggest hackathon yet. 80 participants, 20 teams, and six industry judges. The energy was nuclear.",
    media: [
      { id: "h3-01", type: "image", src: PH("h301", 1200, 800), thumb: PH("h301", 400, 267), width: 1200, height: 800, span: "2", caption: "Opening ceremony — lights down, countdown up." },
      { id: "h3-02", type: "image", src: PH("h302", 800, 1100), thumb: PH("h302", 300, 412), width: 800, height: 1100, span: "tall", caption: "Late-night debugging session, floor 2." },
      { id: "h3-03", type: "image", src: PH("h303", 900, 600), thumb: PH("h303", 400, 267), width: 900, height: 600, span: "1", caption: "Team GravityFlip demoing their VR puzzle game." },
      { id: "h3-04", type: "video", src: PH("h304", 1280, 720), thumb: PH("h304", 640, 360), videoMp4: "https://www.w3schools.com/html/mov_bbb.mp4", width: 1280, height: 720, span: "2", caption: "Highlight reel — 24 hours in 90 seconds." },
      { id: "h3-05", type: "image", src: PH("h305", 900, 900), thumb: PH("h305", 400, 400), width: 900, height: 900, span: "1", caption: "Prize ceremony — ₹50K awarded." },
      { id: "h3-06", type: "image", src: PH("h306", 1100, 700), thumb: PH("h306", 500, 320), width: 1100, height: 700, span: "2", caption: "Judges deliberating over the final 3 projects." },
      { id: "h3-07", type: "image", src: PH("h307", 700, 950), thumb: PH("h307", 300, 400), width: 700, height: 950, span: "tall", caption: "The winning team — CampusAR." },
      { id: "h3-08", type: "image", src: PH("h308", 900, 600), thumb: PH("h308", 400, 267), width: 900, height: 600, span: "1", caption: "Mentorship corner — 1-on-1 sessions throughout the night." },
    ],
  },
  // ─────────────────────────────────────────────────────────────────
  {
    id: "blender-bootcamp",
    slug: "blender-bootcamp",
    title: "Blender Bootcamp",
    date: "Jan 2024",
    location: "Computer Lab 3",
    coverThumb: PH("blendcover", 800, 500),
    accent: "#a78bfa",
    tagline: "3 days · 40 students · 0 prior experience needed",
    description:
      "From absolute zero to game-ready assets. Every student shipped a 3D model by day 3.",
    media: [
      { id: "bb-01", type: "image", src: PH("bb01", 1200, 750), thumb: PH("bb01", 500, 312), width: 1200, height: 750, span: "2", caption: "Day 1 kickoff — 40 laptops, one Blender version." },
      { id: "bb-02", type: "image", src: PH("bb02", 800, 1000), thumb: PH("bb02", 320, 400), width: 800, height: 1000, span: "tall", caption: "Students iterating on their first mesh objects." },
      { id: "bb-03", type: "video", src: PH("bb03", 1280, 720), thumb: PH("bb03", 640, 360), videoMp4: "https://www.w3schools.com/html/mov_bbb.mp4", width: 1280, height: 720, span: "2", caption: "Day 3 render showcase — final model walkthroughs." },
      { id: "bb-04", type: "image", src: PH("bb04", 900, 600), thumb: PH("bb04", 400, 267), width: 900, height: 600, span: "1", caption: "Best model of the bootcamp — rigged character." },
      { id: "bb-05", type: "image", src: PH("bb05", 900, 600), thumb: PH("bb05", 400, 267), width: 900, height: 600, span: "1", caption: "Shading and texturing workshop — day 2 afternoon." },
      { id: "bb-06", type: "image", src: PH("bb06", 1100, 700), thumb: PH("bb06", 500, 320), width: 1100, height: 700, span: "2", caption: "Group photo — every participant shipped something." },
    ],
  },
  // ─────────────────────────────────────────────────────────────────
  {
    id: "ar-at-scale-talk",
    slug: "ar-at-scale-talk",
    title: "AR at Scale — Guest Talk",
    date: "Nov 2023",
    location: "Seminar Hall",
    coverThumb: PH("talkcover", 800, 500),
    accent: "#f59e0b",
    tagline: "150+ attendees · 1 industry speaker · full recording",
    description:
      "A senior engineer broke down how production AR systems work at city scale. Packed hall. No empty seats.",
    media: [
      { id: "talk-01", type: "image", src: PH("talk01", 1300, 800), thumb: PH("talk01", 500, 308), width: 1300, height: 800, span: "2", caption: "Speaker on stage — 150+ in the room." },
      { id: "talk-02", type: "image", src: PH("talk02", 800, 1050), thumb: PH("talk02", 300, 394), width: 800, height: 1050, span: "tall", caption: "Audience — every seat taken." },
      { id: "talk-03", type: "image", src: PH("talk03", 900, 600), thumb: PH("talk03", 400, 267), width: 900, height: 600, span: "1", caption: "Live demo of AR cloud anchors at scale." },
      { id: "talk-04", type: "video", src: PH("talk04", 1280, 720), thumb: PH("talk04", 640, 360), videoMp4: "https://www.w3schools.com/html/mov_bbb.mp4", width: 1280, height: 720, span: "2", caption: "Full talk recording — 45 min + Q&A." },
      { id: "talk-05", type: "image", src: PH("talk05", 900, 600), thumb: PH("talk05", 400, 267), width: 900, height: 600, span: "1", caption: "Post-talk networking session." },
    ],
  },
  // ─────────────────────────────────────────────────────────────────
  {
    id: "game-jam-1",
    slug: "game-jam-1",
    title: "48HR Game Jam",
    date: "Sep 2023",
    location: "Club Lab",
    coverThumb: PH("jamcover", 800, 500),
    accent: "#f472b6",
    tagline: "10 teams · 48 hours · Unity + Unreal",
    description:
      "Theme: Spatial Chaos. 10 teams, 48 hours, and games so weird we still talk about them.",
    media: [
      { id: "gj-01", type: "image", src: PH("gj01", 1200, 750), thumb: PH("gj01", 500, 312), width: 1200, height: 750, span: "2", caption: "Midnight sprint — all 10 teams still grinding." },
      { id: "gj-02", type: "image", src: PH("gj02", 800, 900), thumb: PH("gj02", 350, 394), width: 800, height: 900, span: "tall", caption: "GravityFlip team testing their VR puzzle platformer." },
      { id: "gj-03", type: "image", src: PH("gj03", 900, 600), thumb: PH("gj03", 400, 267), width: 900, height: 600, span: "1", caption: "Judging session — all games live and playable." },
      { id: "gj-04", type: "image", src: PH("gj04", 900, 600), thumb: PH("gj04", 400, 267), width: 900, height: 600, span: "1", caption: "Winner announced — GravityFlip takes it." },
      { id: "gj-05", type: "video", src: PH("gj05", 1280, 720), thumb: PH("gj05", 640, 360), videoMp4: "https://www.w3schools.com/html/mov_bbb.mp4", width: 1280, height: 720, span: "2", caption: "All 10 games playable on itch.io — highlights reel." },
      { id: "gj-06", type: "image", src: PH("gj06", 1100, 700), thumb: PH("gj06", 500, 320), width: 1100, height: 700, span: "2", caption: "Group photo post-jam — exhausted but proud." },
    ],
  },
];

// Utility — flat lookup by event slug
export const getEventBySlug = (slug) =>
  EVENTS.find((e) => e.slug === slug) ?? null;

// Utility — flat media lookup across all events (for lightbox deep-link)
export const getMediaById = (mediaId) => {
  for (const event of EVENTS) {
    const item = event.media.find((m) => m.id === mediaId);
    if (item) return { event, item };
  }
  return null;
};