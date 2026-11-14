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
| **Projects & Showcase** | [`projectData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/projectData.js) | `PROJECTS`, `projectsData`, `CATEGORIES` | Unified master projects catalog, home marquee showcase, and `featured` filtering |
| **Events, Moments & Gallery** | [`eventsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/eventsData.js) | `EVENTS`, `eventsData`, `getEventBySlug` | Unified single source of truth for all events, moments 3D photo rain, and `/gallery` Pinterest lightbox albums |
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

All projects are managed in the single unified dataset [`src/data/projectData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/projectData.js). This single master file powers both the **Home Page interactive marquee table** and the **Deep `/projects` catalog page**.

### Adding or Editing a Project:

1. **Place project thumbnail:** Save an optimized WebP image (e.g. 1200×800) in `src/assets/images/projects/`.
2. **Import image:** In `src/data/projectData.js`:
   ```javascript
   import MyProjectImg from "../assets/images/projects/my-project.webp";
   ```
3. **Add entry to `PROJECTS` array:**
   ```javascript
   {
     id: "my-project",
     title: "Project Title",
     tag: "VR Game",                               // Displayed on Home page row badge
     category: "vr",                               // Filter: "game" | "vr" | "ar" | "webxr" | "mr" | "tool"
     status: "live",                               // "live" | "prototype" | "rnd" | "archived"
     year: 2026,
     featured: true,                               // If true, appears on the Home page showcase
     img: MyProjectImg,                            // WebP thumbnail for cards and hover preview
     image: MyProjectImg,
     tagline: "One-line catchy summary of the project",
     platform: "Meta Quest 3 · OpenXR",
     team: [
       { name: "Student Name", role: "XR Architect" },
     ],
     stack: ["Unity", "OpenXR", "C#", "Blender"],
     tags: ["vr", "spatial-ui", "openxr"],
     description: "Comprehensive 2–3 sentence overview of the project mechanics and features.",
     links: {
       live: "https://realxr.in/project-link",
       github: "https://github.com/realxr-org/project",
       demo: "https://youtube.com/watch?v=sample",
     },
   }
   ```

> [!TIP]
> **Homescreen Visibility Control:**
> Set `featured: true` to display the project on the homepage interactive hover list. Set `featured: false` to keep it exclusively in the `/projects` catalog.

---

## 4. Managing Events & Gallery Albums

All event showcase items, moments 3D photo rain, and full Pinterest gallery albums are unified in [`src/data/eventsData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/eventsData.js).

### 4.1 Event Schema & Adding a New Event
Add a new object to the `EVENTS` array in `src/data/eventsData.js`:
```javascript
{
  id: "vradical-mega-event-2026",
  slug: "vradical-mega-event-2026",
  title: "VRadical Mega Event 2026",
  date: "October 2026",
  location: "Auditorium, IES IPS Academy",
  desc: "Central India's premier student spatial computing exhibition featuring live VR demos, spatial audio showcases, and interactive hardware rigs.",
  description: "Central India's premier student spatial computing exhibition featuring live VR demos, spatial audio showcases, and interactive hardware rigs.",
  tagline: "Central India's Premier Spatial Computing Exhibition",
  tags: ["Spatial Computing", "Meta Quest", "WebGL", "Community"],
  accent: "#00E5FF",
  coverThumb: MegaEventPhoto1,
  coverGradient: "linear-gradient(135deg, #0A192F 0%, #00E5FF 100%)",
  featured: true, // true = appears on homepage timeline & moments photo rain; false = gallery only
  images: [MegaEventPhoto1, MegaEventPhoto2, MegaEventPhoto3],
  media: createEventMedia(
    [MegaEventPhoto1, MegaEventPhoto2, MegaEventPhoto3],
    "vradical-mega-event-2026"
  ),
}
```

> **Home vs Gallery Filtering:**
> - Set `featured: true` to include the event in the homepage `PastEvents` card stack and feed its first 3 images to the `Moments` 3D falling photo rain.
> - Set `featured: false` if you want the event album to appear exclusively in the `/gallery` dashboard without cluttering the homepage.
> - The helper `createEventMedia(images, slug)` automatically formats each photo with natural Pinterest aspect ratios (`1200x800`, `800x1100`, etc.), dynamic spans (`"2"`, `"tall"`, `"1"`), and sequential identifiers for the Lightbox modal.

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

---

## 8. Configuring EmailJS for Join Form Applications

The **Join RealXR** application form on the homepage uses [EmailJS](https://www.emailjs.com/) to route student applications straight to your team inbox without requiring a backend server.

### 8.1 Setup Instructions (Takes 3 Minutes):
1. Sign up for a free account at [EmailJS](https://www.emailjs.com/) (200 free emails/month).
2. Under **Email Services**, click **Add New Service** and connect your Gmail / Outlook / lab email (e.g. Service ID: `service_realxr`).
3. Under **Email Templates**, click **Create New Template** and configure:
   - **Subject:** `🚀 New RealXR Member Application: {{user_name}} ({{branch_year}})`
   - **Content:**
     ```text
     Applicant Name: {{user_name}}
     Branch & Year:  {{branch_year}}
     Email:          {{user_email}}
     Phone:          {{phone_number}}
     Interests:      {{interests}}

     Message / Notes:
     {{message}}

     Submitted at: {{submitted_at}}
     ```
   - **Settings:** Set **Reply-To** to `{{user_email}}` so clicking Reply in Gmail replies directly to the student!
4. Copy your **Service ID**, **Template ID**, and **Public Key** (found in Account > API Keys).
5. Add them to your `.env` (and Vercel environment variables):
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```
> *Note: If keys are omitted in development mode, the form runs safely in simulated mode so you can test animations and UI states without error.*
