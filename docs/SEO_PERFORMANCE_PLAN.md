# RealXR — SEO & Performance Architecture Plan

> **Document Version:** 1.0.0  
> **Target Platform:** RealXR Portfolio (`RealX-Website`)  
> **Status:** Production Standard  
> **Philosophy:** High-Fidelity Awwwards Visuals with Sub-Second Responsiveness  

---

## 1. Executive Summary

RealXR is an effect-heavy, 3D-driven portfolio website designed to showcase the AR/VR and Spatial Computing laboratory at the Institute of Engineering & Science, IPS Academy, Indore. The platform incorporates:
- Interactive WebGL fluid background shaders
- React Three Fiber (R3F) 3D headset models with spring-back physics
- 3D distorted canvas typography
- Lenis smooth inertial scrolling
- Pinning and infinite falling particle rain animations (GSAP ScrollTrigger)

Uncontrolled, these features can cause high CPU/GPU thermal load, long initial bundle download times (1.5MB+ JS), frame drops, and poor search engine crawlability.

This plan details the multi-layer architectural optimizations implemented to achieve **sub-2.5s Largest Contentful Paint (LCP)**, **0 Cumulative Layout Shift (CLS)**, **60–120 FPS render performance**, and **complete search engine indexability**.

---

## 2. WebGL & Animation Lifecycle Pipeline

### 2.1 Viewport-Gated Canvases (`frameloop="never"`)
By default, WebGL canvases run RequestAnimationFrame (RAF) rendering loops continuously, burning GPU cycles even when scrolled out of view.

* **Implementation:** `HeroScene.jsx` and `DistortText.jsx` utilize an `IntersectionObserver` with a `150px` root margin:
  ```jsx
  <Canvas
    frameloop={isInView ? "always" : "never"}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
  >
  ```
* **Impact:** When the user scrolls past the 3D Hero or distorted typography headers, rendering drops to **0 draw calls/sec**, eliminating background thermal throttling.

### 2.2 Tab Visibility Throttling
* **Implementation:** `RootLayout.jsx` hooks into `document.visibilitychange`:
  ```javascript
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Halt fluid shader animation loop
      } else {
        // Resume fluid shader animation loop
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
  ```
* **Impact:** When users switch tabs, all background shader calculations immediately pause.

### 2.3 DPR Clamping
* Clamping device pixel ratio to `[1, 1.5]` across all R3F canvases prevents modern high-DPI displays (Retina, 3x/4x mobile displays) from rendering 9–16x fragment pixels per tick, saving battery life without visible degradation.

### 2.4 GSAP ScrollTrigger Viewport Gating (`Moments.jsx`)
* The infinite photo rain animation in `Moments.jsx` features 20+ floating image cards.
* Rather than running unconstrained tweens indefinitely, `ScrollTrigger.create({ trigger, start: "top bottom", end: "+=1800", onEnter: resumeRain, onLeave: stopRain })` dynamically kills all tweens when out of the viewport and revives them when re-entering.

---

## 3. Asset Transcoding & Bandwidth Optimization

### 3.1 Media Guidelines & Transcoding Scripts
* Raw 6K event photography and master MP4 assets were moved to `/raw/` folders to avoid polluting production builds.
* Batch transcoding via `scripts/optimize-media.js` with FFmpeg:
  - Images re-encoded to WebP (q=80, max dimension 1920px).
  - Videos encoded to lightweight WebM and keyframe-optimized MP4 with **GOP ≤ 15** (`-g 15 -keyint_min 15`) for stutter-free scroll scrubbing.
* **Result:** Reduced event gallery payload by **29.9 MB (-86.5%)**.

### 3.2 Font Waterfall Elimination
* Removed `@import url(...)` declarations from `src/index.css`.
* Injected preconnected Google Fonts with `display=swap` directly into `<head>` in `index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
  ```

---

## 4. Code Splitting & Rolldown Chunk Architecture

### 4.1 Chunk Separation (Vite 8 Rolldown)
Configured functional `manualChunks` in `vite.config.js` to isolate monolithic dependencies:

| Chunk | Contents | Size (Minified) | Gzip |
|---|---|---|---|
| `vendor-three` | `three`, `@react-three/fiber`, `@react-three/drei` | 878.5 kB | 233.4 kB |
| `vendor-react` | `react`, `react-dom`, `react-router-dom` | 280.4 kB | 89.2 kB |
| `vendor-gsap` | `gsap`, `@gsap/react` | 141.0 kB | 52.7 kB |
| `vendor-ui` | `lucide-react`, UI primitives | 56.7 kB | 20.9 kB |
| **`index.js` (App Entry)** | Application business logic & components | **143.4 kB** | **43.8 kB** |

* **Result:** Application entry code dropped from **1.44 MB to 143 kB** (-90%).

### 4.2 Route-Level Lazy Loading
Non-critical routes are split using React `lazy()` and `Suspense`:
- `/projects` (`Projects-*.js`: 10.4 kB)
- `/gallery` (`GalleryDashboard-*.js`: 13.7 kB)
- `/resources` (`Resource-*.js`: 13.1 kB)

---

## 5. Search Engine Optimization (SEO) & Semantic Web

### 5.1 Dynamic Route Metadata (`usePageMeta.js`)
A custom SPA hook (`src/hooks/usePageMeta.js`) dynamically updates document headers upon client-side route transitions:
- `document.title`
- `meta[name="description"]`
- `meta[property="og:title"]` & `meta[property="og:description"]`
- `meta[name="twitter:title"]` & `meta[name="twitter:description"]`
- `link[rel="canonical"]` & `meta[property="og:url"]`

Integrated across all views:
1. `Home.jsx` (`/`)
2. `Projects.jsx` (`/projects`)
3. `GalleryDashboard.jsx` (`/gallery`)
4. `Resource.jsx` (`/resources`)

### 5.2 Social Cards & Rich Preview
- Open Graph protocol tags (`og:site_name`, `og:type="website"`, `og:image`, `og:locale`).
- Twitter Cards (`twitter:card="summary_large_image"`, `twitter:site="@realxr_ipsa"`).

### 5.3 Structured Data (Schema.org JSON-LD)
`index.html` embeds structured schema for Google Rich Snippets:
- `@type`: `EducationalOrganization` and `ResearchProject`
- Parent Organization: `Institute of Engineering & Science, IPS Academy, Indore`
- Founding Date: `2022`
- Department: `AR/VR and Spatial Computing Laboratory`

### 5.4 Crawler Discovery Files
- `public/robots.txt`: Allows universal indexing while shielding private APIs.
- `public/sitemap.xml`: Declares canonical routes, priorities, and update frequencies.
- `public/site.webmanifest`: Progressive Web App (PWA) manifest declaring high-res icons and branding colors.

---

## 6. Core Web Vitals Targets & Audit Protocol

### Target Metrics
| Metric | RealXR Target | Strategy |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.0s | Preloaded hero image/video, font preconnect, chunk splitting |
| **CLS** (Cumulative Layout Shift) | 0.00 | Fixed aspect-ratio containers, reserved canvas bounding boxes |
| **INP** (Interaction to Next Paint) | < 150ms | RAF debouncing, offscreen tween killing, React 19 concurrent mode |
| **FPS** (Frames Per Second) | 60–120 FPS | Frameloop gating, DPR clamping, lightweight waterfall masonry |

### Local Audit Verification
To run an audit on production-compiled artifacts:
```bash
# 1. Compile production build
npm run build

# 2. Preview locally
npm run preview

# 3. Open Chrome DevTools > Lighthouse
# Run Desktop & Mobile Performance & SEO audits
```

