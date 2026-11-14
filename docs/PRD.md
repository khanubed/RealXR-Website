# 📄 Product Requirements Document (PRD)

## Project: RealXR Portfolio & Spatial Showcase Platform
**Organization:** RealXR Club · Institute of Engineering and Science, IPS Academy, Indore  
**Established:** 2022  
**Document Version:** 2.0.0  
**Status:** Active Production  
**Primary Repository:** `RealX-Website` (Self-Contained Standalone Web Application)  

---

## 1. Executive Summary & Vision

### 1.1 Vision
To establish an **Awwwards-caliber digital experience** that mirrors the innovative, experimental, and futuristic reality of **RealXR** — the premier AR/VR and Spatial Computing student laboratory at the Institute of Engineering and Science (IES IPS Academy). 

### 1.2 Mission
- **Showcase Innovation:** Highlight student-engineered Augmented Reality, Virtual Reality, Mixed Reality, and WebXR prototypes with high-fidelity visual context and interactive 3D elements.
- **Archive Milestones:** Immortalize lab hackathons, workshops, bootcamps, and moments through dynamic gallery systems and cinematic visual timelines.
- **Resource Decentralization:** Democratize spatial computing education by sharing curated roadmaps, tools, papers, and tutorials with the next generation of engineers.
- **Recruit Talent:** Streamline multi-disciplinary club recruitments through an integrated, interactive application funnel.
- **Celebrate Community:** Honor the core team, active contributors, and alumni pioneers (including engineers advancing to Meta Reality Labs and top spatial labs).

---

## 2. Problem Statement & Strategic Objectives

| Problem Encountered | Strategic Solution in RealXR |
| :--- | :--- |
| **Generic Templates:** Most college club portfolios rely on static Bootstrap or generic WordPress templates that fail to communicate technical prowess in 3D/XR. | **Awwwards-Level Spatial Aesthetics:** Built with Three.js, React Three Fiber, custom GLSL fluid shaders, GSAP ScrollTrigger timeline scrubbing, and Lenis virtual smooth scrolling. |
| **Fragmented Media & Project Portfolios:** Projects, hackathon snapshots, and workshop guides are scattered across Google Drive, Discord, and Instagram. | **Centralized Showcase & Vault:** Unified `/projects` catalog, `/gallery` lightbox dashboard, and `/resources` learning repository. |
| **Fragile CMS Dependency & Server Downtime:** External CMS platforms or backend databases frequently crash, incur hosting bills, or fail during high-traffic college fairs. | **Code-First Zero-Downtime Architecture:** All content is managed directly in structured JavaScript data modules in `src/data/*`, guaranteeing 100% uptime, 0ms database latency, and instant global edge delivery. |
| **Uncontrolled Content Drift:** Ad-hoc database edits without code review often introduce broken image links or styling mismatches. | **Version-Controlled Content Operations:** Content updates follow Git versioning with automated build validation (`npm run build`), ensuring rock-solid stability and peer review. |

---

## 3. Target User Personas

### Persona A: Prospective Student Applicant
- **Profile:** First- or second-year engineering student passionate about game development, 3D modeling, or spatial computing.
- **Goals:** Understand what domains RealXR operates in (AR, VR, Game Dev, 3D Modeling, WebXR), explore prerequisite knowledge, browse resources, and apply for membership.
- **Key Touchpoints:** Hero 3D interactive headset, Domains horizontal slider, Join section application form, Resources tab.

### Persona B: Industry Recruiter / Venture Partner
- **Profile:** Tech recruiter or engineering lead evaluating student engineering caliber and collaborative project complexity.
- **Goals:** Inspect deployed applications, verify tech stack capabilities (Unity, Unreal Engine, OpenXR, WebGL, shaders), and identify high-performing students.
- **Key Touchpoints:** Projects showcase, individual project modal/tagline, stack badges (ARCore, WebXR, Blender), and Team roster.

### Persona C: College Administration & Faculty
- **Profile:** Department heads, academic deans, and external accreditation committees.
- **Goals:** Review lab activities, verify student engagement statistics, and witness institutional prestige through public awards and hackathons.
- **Key Touchpoints:** Moments timeline, Past Events showcases, Hackathon galleries, and Alumni hall of fame.

### Persona D: Lab Technical Lead / Content Coordinator
- **Profile:** Current RealXR Core Team member responsible for lab releases, project showcases, and team announcements.
- **Goals:** Rapidly publish event photos, update member profiles, and add recent project links directly in code with automated build verification.
- **Key Touchpoints:** Structured data modules (`src/data/*`), asset directories (`src/assets/*`), and local media optimization CLI (`npm run optimize:media`).

---

## 4. Key Functional Requirements

```
                       ┌────────────────────────────────────────────────────────┐
                       │               REALXR PLATFORM ECOSYSTEM                │
                       └────────────────────────────────────────────────────────┘
                                                    │
         ┌──────────────────────────────────────────┴──────────────────────────────────────────┐
         ▼                                                                                     ▼
┌───────────────────────────────────────────────────────┐   ┌───────────────────────────────────────────────────────┐
│              INTERACTIVE 3D CLIENT (SPA)              │   │             CODE-FIRST CONTENT REPOSITORY             │
├───────────────────────────────────────────────────────┤   ├───────────────────────────────────────────────────────┤
│ • 3D Canvas & WebGL Viscous Fluid Shaders             │   │ • Structured JS Data Modules (`src/data/*`)           │
│ • Lenis & GSAP ScrollTrigger Scrubbing                │   │ • High-Resolution WebP / WebM Media Pipeline          │
│ • Deep Catalog Pages (`/projects`, `/gallery`, etc.)  │   │ • Git-Tracked History & Pull Request Workflow         │
│ • Lightbox Media Dashboard & Modal Viewers            │   │ • Zero External Database / Zero Backend Latency       │
│ • Pinned 250vh Recruitment Funnel                     │   │ • Automated Build Verification (`npm run build`)      │
└───────────────────────────────────────────────────────┘   └───────────────────────────────────────────────────────┘
```

### 4.1 Landing Page Experience (`/`)
1. **Interactive 3D Hero Scene:**
   - Real-time 3D VR Headset model rendered via React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`).
   - Pointer-capture interaction: Mouse drag rotates the headset in 3D space with continuous angular velocity.
   - On pointer release, smooth GSAP `power3.out` spring snapback resets the model to `[0, 0, 0]` orientation.
   - Retro-futuristic marquee ticker: *"We Don't Just Study the Future — We Build It."*
2. **Scroll-Scrubbed Video Timeline:**
   - Apple-style frame-accurate scrubbing of a WebM/MP4 video driven by GSAP `ScrollTrigger`.
   - `warmDecoder` technology to pre-roll the browser video decoder and avoid frame stuttering.
   - Dual breakpoint architecture (`gsap.matchMedia`) providing desktop video scrub and mobile-optimized video playback.
3. **Domains Matrix:**
   - Horizontal pinned slider presenting club disciplines:
     1. AR Development (ARKit, ARCore, Spark AR)
     2. VR Development (Unity XR, Unreal Engine)
     3. Game Development
     4. 3D Modelling (Blender)
     5. WebXR & Spatial Web
   - Counter-scrolling dual marquee velocity text strips.
4. **Interactive Projects Showcase:**
   - Floating interactive cursor card that tracks mouse movement via `gsap.quickTo`.
   - Velocity marquee speed scaling according to user scroll velocity.
5. **Moments 3D Falling Cards & Event Matrix:**
   - Randomized 3D particle rain of event photos with depth layering.
   - Cursor-adjacent dynamic image previews on event item hover.
6. **RedSection Institutional Typography:**
   - Pinned kinetic red section featuring three-tier institutional designation:
     `Built At` (slides left), `Institute of Engineering and Science` (center scale + overlay blend), `IPS Academy` (slides right).

---

## 5. Non-Functional Requirements & Performance Targets

| Metric | Target Standard | Implementation Strategy |
| :--- | :--- | :--- |
| **Frame Rate** | 60 FPS | Gated RAF loops, Lenis virtual scroll, unified GSAP ticker, GPU domain-warping shaders. |
| **Bundle Size** | < 160 kB (Entry JS) | Rolldown functional chunking (`vendor-three`, `vendor-react`, `vendor-gsap`, `vendor-ui`). |
| **Core Web Vitals** | LCP < 2.0s, CLS < 0.05 | Eager pre-decoded hero assets, explicit image dimensions, local font preconnections. |
| **GPU Conservation** | 0 draw calls offscreen | `IntersectionObserver` halts Three.js canvas renders whenever elements exit viewport. |
| **Availability** | 100.0% Uptime | Static edge delivery across global CDNs with zero backend dependency. |
| **SEO & Discoverability** | 100/100 Lighthouse SEO | Schema.org JSON-LD structured data, dynamic OpenGraph head meta, XML sitemap, robots.txt. |
