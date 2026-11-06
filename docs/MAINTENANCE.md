# 🛠️ Maintenance & Content Operations Guide

## RealXR Portfolio & Spatial Showcase Platform

This guide provides step-by-step developer instructions to update, manage, and maintain all content on the **RealXR** platform directly in code — including **Hero Copy, Projects, Events, Team Members, Gallery Albums, and Learning Resources**.

---

## 1. Code-First Content Operations Overview

The RealXR platform manages all dynamic content through clean, modular JavaScript datasets located in [`src/data/`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CODE-FIRST CONTENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ • All content lives inside `src/data/*.js` modules                          │
│ • Zero external database dependency, zero server latency                    │
│ • Changes are tracked in Git, reviewed via Pull Requests                    │
│ • Build verification via `npm run build` catches errors before deployment   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Content Data Map

| Section | Data File | Key Exports | Description |
| :--- | :--- | :--- | :--- |
| **Hero & Tagline** | [`heroData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/heroData.js) | `heroData` | Title, tagline, circular seal, 3D headset assets, video links, ticker |
| **About Mission** | [`aboutData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/aboutData.js) | `aboutData` | Manifesto, engineering pillars, and lab philosophy |
| **Domains Matrix** | [`domainsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/domainsData.js) | `domainsData` | AR, VR, Game Dev, 3D Modelling, WebXR cards and icons |
| **Home Projects** | [`projectData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/projectData.js) | `projectsData` | Featured marquee rows with cursor thumbnail hover cards |
| **Projects Page** | [`projectsPageData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/projectsPageData.js) | `PROJECTS`, `CATEGORIES` | Filterable project catalog with status badges, tags, and links |
| **Events & Moments** | [`eventsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/eventsData.js) | `eventsData` | Hackathons, workshops, induction events, and moments photo rain |
| **Gallery Albums** | [`galleryData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/galleryData.js) | `EVENTS` | Media collections with aspect ratios, captions, and Lightbox assets |
| **Team & Alumni** | [`teamsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/teamsData.js) | `teams` | Squad rosters (Leadership, Web Dev, AR/VR, Social, Alumni) |
| **Resource Vault** | [`resourceData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/resourceData.js) | `RESOURCES_DATA` | Filterable spatial roadmaps, tools, papers, and tutorials |

---

## 2. Managing Team Members & Alumni

Open [`src/data/teamsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/teamsData.js).

Teams are segmented into functional squads:
- `core` — `01 — Leadership`
- `web` — `02 — Web & Software`
- `xr` — `03 — Spatial Computing`
- `social` — `04 — Social Media & PR`
- `alumni` — `06 — Alumni Legends`

### Adding a New Team Member:

1. **Place member photo:** Save optimized WebP image (approx. 600×800) in `src/assets/images/Teams/`.
2. **Import image:** At the top of `teamsData.js`:
   ```javascript
   import NewMemberImg from "../assets/images/Teams/NewMember.webp";
   ```
3. **Add entry to squad `members` array:**
   ```javascript
   {
     name: "Alex Sharma",
     role: "Spatial Audio Specialist",
     desc: "Specializes in Ambisonic spatial audio pipelines and HRTF acoustics inside Unity and WebXR.",
     img: NewMemberImg,
     socials: {
       linkedin: "https://linkedin.com/in/alex-sharma",
       github: "https://github.com/alex-xr",
       instagram: "https://instagram.com/alex_xr",
     },
   }
   ```

---

## 3. Managing Projects & Showcases

### 3.1 Home Page Projects Marquee
Open [`src/data/projectData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/projectData.js).

Add or update project items displayed on the homepage with interactive hover preview cards:
```javascript
{
  id: "05",
  title: "NEUROLENS AR",
  category: "Augmented Reality",
  year: "2026",
  image: NeuroLensThumb, // Import from src/assets/images/projects/
  tags: ["ARCore", "WebXR", "Three.js"],
  link: "https://github.com/realxr-org/neurolens",
}
```

### 3.2 Deep Projects Catalog Page (`/projects`)
Open [`src/data/projectsPageData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/projectsPageData.js).

Add a project to the filterable catalog:
```javascript
{
  id: "p-neurolens",
  title: "NeuroLens AR",
  tagline: "Collaborative hand-tracked AR anatomy explorer for spatial classrooms",
  category: "ar",          // "ar" | "vr" | "mr" | "webxr" | "game" | "tool"
  status: "live",           // "live" (green) | "prototype" (cyan) | "rnd" (magenta) | "archived" (slate)
  year: 2026,
  featured: true,          // If true, highlighted in top spotlight
  platform: "Meta Quest 3 · WebXR",
  team: [
    { name: "Pushpraj Singh Jhala", role: "XR Architect" },
    { name: "Parag Malvi", role: "Frontend Lead" },
  ],
  stack: ["Three.js", "WebXR Device API", "React Three Fiber", "WebAssembly"],
  tags: ["hand-tracking", "spatial-ui", "education"],
  description: "Allows medical students to inspect 3D volumetric MRI scans collaboratively in real-time AR.",
  links: {
    live: "https://realxr.in/projects/neurolens",
    github: "https://github.com/realxr-org/neurolens",
    demo: "https://youtube.com/watch?v=sample",
  },
}
```

---

## 4. Managing Events & Gallery Albums

### 4.1 Home Page Events Matrix
Open [`src/data/eventsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/eventsData.js).

Update major club event headlines and photos that feed into the falling photo rain:
```javascript
{
  id: "megaevent-2026",
  title: "REALXR ANNUAL EXPO 2026",
  date: "OCTOBER 2026",
  location: "IPS ACADEMY AUDITORIUM",
  tagline: "Central India's largest student spatial computing exhibition showcasing 15+ interactive prototypes.",
  photos: [Photo1, Photo2, Photo3], // Import from src/assets/images/events/
}
```

### 4.2 Full Gallery Albums & Lightbox (`/gallery`)
Open [`src/data/galleryData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/galleryData.js).

Add albums or media items to the masonry grid:
```javascript
{
  id: "induction-2026",
  title: "Lab Induction 2026",
  subtitle: "Welcoming 50+ New Spatial Computing Innovators",
  date: "September 2026",
  items: [
    {
      id: "ind-01",
      src: Induction01,
      type: "image",
      title: "Hands-on VR Rig Assembly",
      aspectRatio: "3/2", // "3/2" | "2/3" | "1/1" | "16/9"
      width: 1200,
      height: 800,
    },
    {
      id: "ind-02",
      src: "/videos/induction-reel.mp4",
      type: "video",
      title: "Induction Aftermovie Clip",
      aspectRatio: "16/9",
      width: 1920,
      height: 1080,
    },
  ],
}
```

---

## 5. Managing Learning Resources (`/resources`)

Open [`src/data/resourceData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/resourceData.js).

Add roadmaps, tools, papers, or tutorials to the vault:
```javascript
{
  id: "res-gaussian-splatting",
  title: "3D Gaussian Splatting for Real-Time Radiance Fields",
  category: "research-papers", // "roadmaps" | "tools-sdks" | "research-papers" | "tutorials-courses" | "documentation"
  type: "paper",
  level: "Advanced",           // "Beginner" | "Intermediate" | "Advanced"
  domain: "3D Graphics",
  readTime: "25 min read",
  featured: true,
  tags: ["Gaussian Splatting", "NeRF", "SIGGRAPH", "Photogrammetry"],
  excerpt: "The breakthrough SIGGRAPH 2023 paper by Kerbl et al. that revolutionized real-time novel view synthesis.",
  description: "Comprehensive guide and implementation notes for training 3D Gaussians from photogrammetry datasets.",
  links: [
    { label: "Read Paper (arXiv)", url: "https://arxiv.org/abs/2308.04079", primary: true },
    { label: "Official Repo", url: "https://github.com/graphdeco-inria/gaussian-splatting", primary: false },
  ],
}
```

---

## 6. Media Asset Guidelines & CLI Optimization

To maintain smooth 60 FPS scrolling and fast initial load times, follow these media standards:

| Asset Type | Target Resolution | Recommended Format | Max File Size | Target Directory |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Background Video** | 1920×1080 | WebM / MP4 (H.264) | < 3 MB | `src/assets/video/` |
| **Team Member Photos** | 600×800 (3:4 ratio) | WebP (quality 85) | < 120 KB | `src/assets/images/Teams/` |
| **Project Thumbnails** | 1200×800 (3:2 ratio) | WebP (quality 85) | < 250 KB | `src/assets/images/projects/` |
| **Event Gallery Photos** | 1200×800 or 800×1200 | WebP | < 300 KB | `src/assets/images/events/` |
| **Brand Logos & Icons** | Vector SVG or 512×512 | SVG / WebP | < 50 KB | `src/assets/images/` |

### Automated Media Optimization CLI:

Use the built-in media optimization tool powered by FFmpeg:
```bash
# Convert all newly added JPG/PNG images to modern WebP
npm run optimize:images

# Compress and generate scroll-scrubbed video streams (GOP <= 15)
npm run optimize:videos

# Run full media optimization across all assets
npm run optimize:media
```

---

## 7. Verification & Deployment Workflow

Whenever content changes are made:

1. **Verify Build:**
   ```bash
   npm run build
   ```
   Ensure Vite transforms all modules with zero syntax errors.
2. **Preview Locally:**
   ```bash
   npm run preview
   ```
   Inspect modified pages at `http://localhost:4173`.
3. **Commit & Push to Git:**
   ```bash
   git add src/data/ src/assets/
   git commit -m "feat(content): update 2026 team members and projects"
   git push origin main
   ```
   Hosting providers (Vercel, Cloudflare, Netlify) will automatically rebuild and deploy the static site in seconds.
