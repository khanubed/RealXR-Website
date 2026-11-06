# 🎬 Media Optimization, Organization & Transcoding Guide

## RealXR Portfolio & Spatial Showcase Platform

This document establishes the media standards, directory taxonomy, codec configurations, and automation tooling for all static assets across the **RealXR** web platform.

---

## 1. Golden Rules of RealXR Media

To maintain **60 FPS render performance**, instantaneous GSAP scroll scrubbing, and minimal network payloads, every media asset must adhere to these five rules:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 5 REALXR MEDIA COMMANDMENTS                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. 🚫 NO UNOPTIMIZED RASTER FORMATS IN PRODUCTION                           │
│    Raw .png and .jpg files are forbidden in src/assets/ and public/         │
│    All photographic and raster imagery must be WebP (.webp).                │
│                                                                             │
│ 2. ⚡ DUAL-CODEC VIDEO DELIVERY                                             │
│    All background / interactive videos must exist in both:                  │
│    • WebM (VP9 codec) — primary lightweight source                          │
│    • MP4 (H.264 codec) — fallback compatibility source                      │
│                                                                             │
│ 3. 🎯 SHORT GOP FOR SCROLL-SCRUBBED VIDEOS                                  │
│    Any video tied to GSAP ScrollTrigger must be encoded with                │
│    GOP ≤ 15 frames (-g 15) to guarantee instantaneous frame seeking.       │
│                                                                             │
│ 4. 📐 STRICT RESOLUTION CEILINGS                                            │
│    Never import camera-raw resolutions (e.g. 4K/6K). Constrain images to:  │
│    • Event & Banners: Max 1920px width                                      │
│    • Project Thumbnails: Max 1200px width                                   │
│    • Team Avatars: Max 600×800px (3:4 ratio)                                │
│                                                                             │
│ 5. 🗃️ SEPARATION OF RAW MASTERS                                             │
│    Keep uncompressed source files strictly in raw/ directories so they      │
│    are excluded from production Vite build bundles.                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Taxonomy & Organization

All media in `RealX-Website` is structured hierarchically:

```
RealX-Website/
├── public/
│   ├── raw/                       # Uncompressed source logos & masters
│   │   ├── realXr.PNG
│   │   └── realXrLogo.PNG
│   ├── realXr.webp                # Optimized Retina navbar logo (< 30 KB)
│   ├── realXrLogo.webp            # Optimized Favicon & mark (< 15 KB)
│   └── robots.txt
│
└── src/assets/
    ├── icons/                     # Vector icons (.svg, .jsx)
    │   └── icon.jsx
    ├── images/
    │   ├── Hero/
    │   │   ├── raw/               # Uncompressed 3D render masters
    │   │   │   └── headset.png    # Raw 4.7 MB master (excluded from bundle)
    │   │   └── headset.webp       # Production 3D keyart (114 KB)
    │   │
    │   ├── projects/              # Project showcase preview thumbnails
    │   │   ├── ar-games.webp
    │   │   ├── IES-Building.webp
    │   │   ├── Lunar-walk.webp
    │   │   ├── maze.webp
    │   │   ├── RealCarX.webp
    │   │   ├── Scary-House.webp
    │   │   ├── squid-game.webp
    │   │   └── virtomo.webp
    │   │
    │   ├── Teams/                 # Team member portraits (3:4 aspect ratio)
    │   │   ├── Parag.webp
    │   │   ├── pushpraj.webp
    │   │   ├── Aakif.webp
    │   │   ├── ubed.webp
    │   │   ├── Sourabh.webp
    │   │   └── ... (all members in .webp)
    │   │
    │   └── events/                # Event albums segmented by event name
    │       ├── Induction/
    │       │   ├── induction-2025-1.webp
    │       │   └── ...
    │       └── MegaEvent/
    │           ├── megaevent-2024-1.webp
    │           └── ...
    │
    └── video/
        ├── raw/                   # Raw camera / Blender video recordings
        │   └── input.mp4          # Uncompressed footage
        ├── hero.webm              # Production WebM (VP9, ~540 KB)
        ├── hero-scrub.mp4         # Production MP4 (H.264, GOP=15, ~590 KB)
        └── hero.mp4               # Full-rate fallback MP4
```

---

## 3. Specifications & Budget Table

| Asset Type | Location | Target Format | Max Dimensions | Quality Target | Max Size Budget |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Scrub Video** | `src/assets/video/` | WebM (VP9) + MP4 (H.264) | 1920×1080 | CRF 30 / GOP 15 | **< 600 KB** |
| **Hero 3D Keyart** | `src/assets/images/Hero/` | WebP | 800×800 | Quality 85 | **< 150 KB** |
| **Team Headshots** | `src/assets/images/Teams/` | WebP | 600×800 (3:4) | Quality 82 | **< 100 KB** |
| **Project Cards** | `src/assets/images/projects/`| WebP | 1200×800 (3:2) | Quality 82 | **< 150 KB** |
| **Event Photos** | `src/assets/images/events/*/` | WebP | Max 1920px width | Quality 80 | **< 350 KB** |
| **Logos & Badges** | `public/` | WebP / SVG | Max 600px width | Quality 85 | **< 30 KB** |

---

## 4. Scroll-Scrubbed Video Engineering (Why GOP Matters)

In traditional video streaming (YouTube, Netflix), encoders insert a **Keyframe (I-frame)** every 250 frames (~10 seconds) to maximize compression. Intermediate frames (P-frames and B-frames) only store deltas.

```
Standard Streaming Video (GOP = 250):
[ I-frame ] ────── 249 delta frames ────── [ I-frame ]
⚠️ Scrolling backwards forces the browser to decode up to 249 frames in reverse!
   Result: Heavy stutter, delayed seeks, dropped frames.

RealXR Scroll-Scrubbed Video (GOP = 15):
[ I ] ── 14 frames ── [ I ] ── 14 frames ── [ I ] ── 14 frames ── [ I ]
✅ Keyframes occur every 0.5 seconds (at 30 fps).
   Result: Instantaneous forward/backward scrubbing at 60 FPS in GSAP ScrollTrigger!
```

### The Required FFmpeg Command for Scrub Videos:
```bash
ffmpeg -i input.mp4 \
  -vf "scale='min(iw,1920)':-2" \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -g 15 \
  -keyint_min 15 \
  -sc_threshold 0 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac -b:a 128k \
  output-scrub.mp4 -y
```

---

## 5. Automated Media Optimization Tool (`scripts/optimize-media.js`)

We have created an automated, zero-dependency Node.js CLI script that handles all transcoding and compression using your system's FFmpeg engine.

### 5.1 Quick NPM Commands
Run these commands from the `RealX-Website` root:

```bash
# 1. Scan and optimize all unoptimized images & videos
npm run optimize:media

# 2. Convert PNG/JPG images to WebP only
npm run optimize:images

# 3. Transcode videos to WebM (VP9) and Scrub MP4 (GOP=15)
npm run optimize:videos

# 4. Deep optimize: Recompress oversized existing .webp files (>500KB)
npm run optimize:all
```

---

### 5.2 Advanced CLI Flags

You can invoke the script directly with custom arguments:

```bash
node scripts/optimize-media.js [options]
```

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--type=<all\|image\|video>` | string | `all` | Select target media types to process. |
| `--input=<path>` | string | auto-scan | Target a specific file or folder. |
| `--output=<path>` | string | same dir | Specify custom destination folder. |
| `--quality=<1-100>` | number | `82` | WebP compression quality. |
| `--max-width=<px>` | number | `1920` | Downscales images larger than this width. |
| `--crf=<18-45>` | number | `30` | WebM VP9 quality level (lower = higher quality). |
| `--gop=<frames>` | number | `15` | Keyframe interval for scrub-friendly MP4s. |
| `--recompress-webp` | boolean | `false` | Re-encodes existing `.webp` files larger than 500KB. |
| `--dry-run` | boolean | `false` | Previews files and potential savings without writing. |

#### CLI Examples:

```bash
# Preview what would be converted without modifying files
node scripts/optimize-media.js --dry-run

# Optimize a single newly downloaded image
node scripts/optimize-media.js --input=src/assets/images/Teams/new-member.png

# Optimize an entire folder with custom max width (e.g. avatars)
node scripts/optimize-media.js --input=src/assets/images/Teams --max-width=800 --quality=80

# Convert a new hero video with custom scrub GOP
node scripts/optimize-media.js --input=src/assets/video/raw/event-recap.mp4 --gop=12
```

---

## 6. Pre-Commit Media Checklist

Before pushing new images or videos to GitHub:

- [ ] **Format Check:** Is the file `.webp` (images) or `.webm` / `.mp4` (videos)?
- [ ] **No Capital Extensions:** Ensure filenames end in `.webp` and `.mp4`, not `.PNG` or `.JPG`.
- [ ] **Naming Standard:** Use lowercase `kebab-case` (e.g. `hackathon-3-stage.webp`, not `IMG_58392.JPG`).
- [ ] **Size Verification:**
  - Are avatars < 100 KB?
  - Are project cards < 150 KB?
  - Are event photos < 350 KB?
  - Is the video < 1.5 MB?
- [ ] **Raw Master Isolation:** Did you store the high-res camera original in `raw/` so Vite doesn't bundle it?
- [ ] **Run Optimizer:** Did you run `npm run optimize:media` before committing?

