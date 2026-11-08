/**
 * eventsData.js
 * ─────────────────────────────────────────────────────────────────
 * Unified Single Source of Truth for RealXR Events & Moments.
 * Powers:
 *   1. Home Page Moments Rain (falling 3D particle cards)
 *   2. Home Page PastEvents (cursor preview card stack)
 *   3. Gallery Dashboard (/gallery - Pinterest waterfall masonry grid)
 *   4. Fullscreen Lightbox Modal Viewer
 * ─────────────────────────────────────────────────────────────────
 */

import {
  Induction2026_1,
  INDUCTION_2026_IMAGES,
  INDUCTION_2026_VIDEOS,
} from "../assets/images/events/induction-2026";

import {
  Induction2025_1,
  Induction2025_2,
  Induction2025_3,
  Induction2025_4,
  Induction2025_5,
  Induction2025_6,
  Induction2025_7,
  Induction2025_8,
  Induction2025_9,
} from "../assets/images/events/Induction";

import {
  MegaEvent2024_1,
  MegaEvent2024_2,
  MegaEvent2024_3,
  MegaEvent2024_4,
  MegaEvent2024_5,
  MegaEvent2024_6,
  MegaEvent2024_7,
  MegaEvent2024_8,
  MegaEvent2024_9,
  MegaEvent2024_10,
} from "../assets/images/events/MegaEvent";

/**
 * Generates structured media items with natural Pinterest-style
 * masonry aspect ratios and thumbnails for the gallery.
 */
function createEventMedia(images, slug) {
  const spans = ["2", "1", "tall", "1", "2", "1", "tall", "2", "1", "1"];
  const aspectRatios = [
    { width: 1200, height: 800 },
    { width: 900, height: 600 },
    { width: 800, height: 1100 },
    { width: 900, height: 600 },
    { width: 1200, height: 750 },
    { width: 900, height: 600 },
    { width: 800, height: 1000 },
    { width: 1100, height: 700 },
    { width: 900, height: 600 },
    { width: 1200, height: 800 },
  ];

  return images.map((src, i) => {
    const ratio = aspectRatios[i % aspectRatios.length];
    return {
      id: `${slug}-${String(i + 1).padStart(2, "0")}`,
      type: "image",
      src,
      thumb: src,
      width: ratio.width,
      height: ratio.height,
      span: spans[i % spans.length],
    };
  });
}

const MEGA_EVENT_IMAGES = [
  MegaEvent2024_1,
  MegaEvent2024_2,
  MegaEvent2024_3,
  MegaEvent2024_4,
  MegaEvent2024_5,
  MegaEvent2024_6,
  MegaEvent2024_7,
  MegaEvent2024_8,
  MegaEvent2024_9,
  MegaEvent2024_10,
];

const INDUCTION_IMAGES = [
  Induction2025_1,
  Induction2025_2,
  Induction2025_3,
  Induction2025_4,
  Induction2025_5,
  Induction2025_6,
  Induction2025_7,
  Induction2025_8,
  Induction2025_9,
];

// Combine Induction 2026 captures with video highlights
const INDUCTION_2026_ALL_MEDIA = (() => {
  const photoMedia = createEventMedia(INDUCTION_2026_IMAGES, "induction-2026");
  const result = [];
  let videoIdx = 0;
  for (let i = 0; i < photoMedia.length; i++) {
    result.push(photoMedia[i]);
    // Every 2 photos, insert a video highlight if available
    if ((i + 1) % 2 === 0 && videoIdx < (INDUCTION_2026_VIDEOS || []).length) {
      result.push(INDUCTION_2026_VIDEOS[videoIdx++]);
    }
  }
  // Append any remaining videos
  while (videoIdx < (INDUCTION_2026_VIDEOS || []).length) {
    result.push(INDUCTION_2026_VIDEOS[videoIdx++]);
  }
  return result;
})();

// Master events catalog powering both the Homescreen and the Gallery Dashboard
export const EVENTS = [
  {
    id: "induction-2026",
    slug: "induction-2026",
    title: "Induction 2026",
    date: "August 2026 · Main Auditorium & Studio",
    location: "Main Auditorium & AR/VR Studio",
    desc: "Welcoming 50+ freshman innovators into the spatial computing era. Three days of immersive VR booths, hands-on headset assembling, 3D workflow introductions, and annual cohort recruitment.",
    description:
      "Welcoming 50+ freshman innovators into the spatial computing era. Three days of immersive VR booths, hands-on headset assembling, 3D workflow introductions, and annual cohort recruitment.",
    tagline: "50+ Freshman Innovators · Live VR Booths · 3-Day Induction",
    tags: ["Freshers Welcome", "Live Demos", "Recruitment", "Hands-on VR"],
    accent: "#00F5D4",
    coverThumb: Induction2026_1,
    coverGradient:
      "linear-gradient(135deg, #0b2e2b 0%, #061f1d 50%, #020e0d 100%)",
    featured: true,
    images: INDUCTION_2026_IMAGES,
    media: INDUCTION_2026_ALL_MEDIA,
  },
  {
    id: "vradical-mega-event",
    slug: "vradical-mega-event",
    title: "VRadical Mega Event",
    date: "2024 · Main Auditorium",
    location: "Main Auditorium",
    desc: "An incredible seminar featuring guest mentors from VRadical. We dove deep into spatial computing trends, career roadmaps in XR, and hosted an immersive live demo session for attendees.",
    description:
      "An incredible seminar featuring guest mentors from VRadical. We dove deep into spatial computing trends, career roadmaps in XR, and hosted an immersive live demo session for attendees.",
    tagline: "Industry Keynote · Live XR Demos · Career Roadmaps",
    tags: ["Industry Seminar", "Guest Mentors", "Keynote & Demo"],
    accent: "#a78bfa",
    coverThumb: MegaEvent2024_1,
    coverGradient:
      "linear-gradient(135deg, #2d1b69 0%, #1a0533 50%, #0f0020 100%)",
    featured: true,
    images: MEGA_EVENT_IMAGES,
    media: createEventMedia(MEGA_EVENT_IMAGES, "vradical-mega-event"),
  },
  {
    id: "induction-2025",
    slug: "induction-2025",
    title: "Induction 2025",
    date: "2025 · Main Auditorium",
    location: "Main Auditorium",
    desc: "Welcoming the new batch of innovators into the club. Introduced freshman students to the world of spatial computing, demonstrated live AR/VR projects, and kicked off the annual recruitment drive.",
    description:
      "Welcoming the new batch of innovators into the club. Introduced freshman students to the world of spatial computing, demonstrated live AR/VR projects, and kicked off the annual recruitment drive.",
    tagline: "50+ Freshman Innovators · Live VR Booths · Recruitment",
    tags: ["Freshers Welcome", "Live Demos", "Recruitment"],
    accent: "#818cf8",
    coverThumb: Induction2025_1,
    coverGradient:
      "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #020617 100%)",
    featured: true,
    images: INDUCTION_IMAGES,
    media: createEventMedia(INDUCTION_IMAGES, "induction-2025"),
  },
  {
    id: "education-fair-2025",
    slug: "education-fair-2025",
    title: "Education Fair 2025",
    date: "2025 · Exhibition Ground",
    location: "Exhibition Ground",
    desc: "Packed up our hardware, VR headsets, and interactive rigs for our biggest external expo yet. Hundreds of attendees tested our student-built XR projects live.",
    description:
      "Packed up our hardware, VR headsets, and interactive rigs for our biggest external expo yet. Hundreds of attendees tested our student-built XR projects live.",
    tagline: "External Expo · 100+ Visitors · Live Hardware Demos",
    tags: ["Hardware Expo", "Live Demos", "Public Showcase"],
    accent: "#38bdf8",
    coverThumb:
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80",
    coverGradient:
      "linear-gradient(135deg, #072a40 0%, #041a28 50%, #020d14 100%)",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
      "https://images.unsplash.com/photo-1535223289827-a2f56b375b43?w=800&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&q=80",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    ],
    get media() {
      return createEventMedia(this.images, "education-fair-2025");
    },
  },
  {
    id: "education-fair-2024",
    slug: "education-fair-2024",
    title: "Education Fair 2024",
    date: "2024 · Exhibition Ground",
    location: "Exhibition Ground",
    desc: "Our debut exhibition taking AR/VR outside the campus walls. We brought our custom gear setups to demonstrate spatial applications to visitors, parents, and prospective students.",
    description:
      "Our debut exhibition taking AR/VR outside the campus walls. We brought our custom gear setups to demonstrate spatial applications to visitors, parents, and prospective students.",
    tagline: "Debut Expo · Community Outreach · Public Demos",
    tags: ["Project Demos", "Gear Setup", "Outreach"],
    accent: "#34d399",
    coverThumb:
      "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=800&q=80",
    coverGradient:
      "linear-gradient(135deg, #0d2b1d 0%, #0a1f15 50%, #050f0a 100%)",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=800&q=80",
      "https://images.unsplash.com/photo-1623126908029-58cb08a4b0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    ],
    get media() {
      return createEventMedia(this.images, "education-fair-2024");
    },
  },
  {
    id: "youth-bootcamp-2",
    slug: "youth-bootcamp-2",
    title: "Youth Bootcamp 2.0",
    date: "2025 · Innovation Lab",
    location: "Innovation Lab",
    desc: "Advanced edition of our school outreach program. Visiting students got hands-on training with spatial engines, tested VR gear, and built simple immersive scenes.",
    description:
      "Advanced edition of our school outreach program. Visiting students got hands-on training with spatial engines, tested VR gear, and built simple immersive scenes.",
    tagline: "STEM Outreach · Hands-on Workshop · 3D Engines",
    tags: ["School Outreach", "Hands-on Workshop", "Next-Gen Tech"],
    accent: "#f472b6",
    coverThumb:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    coverGradient:
      "linear-gradient(135deg, #2b0a1a 0%, #1a0510 50%, #0f0208 100%)",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&q=80",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
      "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&q=80",
      "https://images.unsplash.com/photo-1580234797602-22c37b4a6217?w=800&q=80",
    ],
    get media() {
      return createEventMedia(this.images, "youth-bootcamp-2");
    },
  },
  {
    id: "youth-bootcamp-1",
    slug: "youth-bootcamp-1",
    title: "Youth Bootcamp 1.0",
    date: "2024 · Computer Center",
    location: "Computer Center",
    desc: "Our inaugural workshop for visiting school students. Introduced core concepts of 3D design, augmented reality, and real-time interaction to inspire future creators.",
    description:
      "Our inaugural workshop for visiting school students. Introduced core concepts of 3D design, augmented reality, and real-time interaction to inspire future creators.",
    tagline: "Inaugural Workshop · 3D Basics · Interactive AR",
    tags: ["STEM Outreach", "Intro to XR", "Mentorship"],
    accent: "#f59e0b",
    coverThumb:
      "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80",
    coverGradient:
      "linear-gradient(135deg, #2b1a00 0%, #1a1000 50%, #0f0900 100%)",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1616509091215-57b834e55a56?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    ],
    get media() {
      return createEventMedia(this.images, "youth-bootcamp-1");
    },
  },
  {
    id: "llc-classes-2025",
    slug: "llc-classes-2025",
    title: "LLC Classes 2025",
    date: "2025 · College AR/VR Studio",
    location: "College AR/VR Studio",
    desc: "Continuing our regular core curriculum sessions. Helping batchmates master advanced 3D asset workflows, real-time shaders, and spatial interaction engines.",
    description:
      "Continuing our regular core curriculum sessions. Helping batchmates master advanced 3D asset workflows, real-time shaders, and spatial interaction engines.",
    tagline: "Core Curriculum · Shaders & R3F · Spatial UI",
    tags: ["Regular Track", "Advanced XR", "Peer Learning"],
    accent: "#a3e635",
    coverThumb:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    coverGradient:
      "linear-gradient(135deg, #1f330a 0%, #131f06 50%, #091003 100%)",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&q=80",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
      "https://images.unsplash.com/photo-1627398240411-8cbc07d0ba6e?w=800&q=80",
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80",
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    ],
    get media() {
      return createEventMedia(this.images, "llc-classes-2025");
    },
  },
  {
    id: "llc-classes-2024",
    slug: "llc-classes-2024",
    title: "LLC Classes 2024",
    date: "2024 · College Computer Lab",
    location: "College Computer Lab",
    desc: "Our foundational hands-on training series teaching college students the basics of augmented and virtual reality development from the ground up.",
    description:
      "Our foundational hands-on training series teaching college students the basics of augmented and virtual reality development from the ground up.",
    tagline: "Foundational Track · Blender to Unity · 0 to 1",
    tags: ["Core Curriculum", "3D Foundations", "Hands-on"],
    accent: "#ec4899",
    coverThumb:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
    coverGradient:
      "linear-gradient(135deg, #330a21 0%, #1f0614 50%, #10030a 100%)",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
      "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1616509091215-57b834e55a56?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    ],
    get media() {
      return createEventMedia(this.images, "llc-classes-2024");
    },
  },
];

// Unified home data contract:
// Pre-filtered static array of featured events ensures stable reference
// and prevents GSAP ScrollTrigger teardown loops on re-renders.
const FEATURED_EVENTS = EVENTS.filter((e) => e.featured !== false);

export const eventsData = {
  title: "MOMENTS THAT SHAPED US",
  subTitle:
    "Every event, every late night, every demo that actually worked — captured here.",
  events: FEATURED_EVENTS,
};

// Utility — flat lookup by event slug
export const getEventBySlug = (slug) =>
  EVENTS.find((e) => e.slug === slug) ?? null;

// Utility — flat media lookup across all events (for lightbox deep-link)
export const getMediaById = (mediaId) => {
  for (const event of EVENTS) {
    const item = (event.media || []).find((m) => m.id === mediaId);
    if (item) return { event, item };
  }
  return null;
};
