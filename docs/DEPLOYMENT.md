# 🚀 Deployment & Environment Setup Guide

## RealXR Portfolio & Spatial Showcase Platform

This document provides instructions for configuring, building, running, and deploying the **RealXR** web application across development and production static hosting environments.

---

## 1. Architecture & Hosting Strategy

RealXR is an optimized **Single Page Application (SPA)** built with **React 19, Vite 8, and Tailwind CSS v4**. Because it uses a self-contained, code-first content architecture, it requires:
- **No external backend server**
- **No database instances**
- **No runtime server compute fees**

It deploys directly to modern global Edge/CDN hosting platforms (**Vercel, Cloudflare Pages, Netlify, GitHub Pages**).

---

## 2. Local Development Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher (Node 20+ recommended).
- **Package Manager:** `npm` (or `pnpm`).

### Quickstart Commands

```bash
# 1. Clone the repository
git clone https://github.com/realxr-org/RealX-Website.git

# 2. Navigate to the project directory
cd RealX-Website

# 3. Install dependencies
npm install

# 4. (Optional) Create environment file
cp .env.example .env

# 5. Start the local Vite development server
npm run dev
```

The website will be accessible at **`http://localhost:5173`**.

---

## 3. Environment Variables Reference

Create a `.env` file in the root of `RealX-Website` (see `.env.example`):

```bash
# Optional Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX)
VITE_GA_MEASUREMENT_ID=

# Optional site canonical origin (default: https://realxr.in)
VITE_SITE_URL=https://realxr.in
```

> [!NOTE]
> All environment variables in Vite must begin with the `VITE_` prefix to be exposed to client-side code.

---

## 4. Production Build & Local Preview

Before deploying, verify the production bundle:

```bash
# 1. Compile and bundle assets using Vite & Rolldown
npm run build

# 2. Preview the production build locally
npm run preview
```

The preview server runs at **`http://localhost:4173`**, allowing you to verify code-splitting, WebGL shaders, and smooth scroll performance before deploying.

---

## 5. Deploying to Production

### 5.1 Deploying on Vercel (Recommended)

1. Push your repository to **GitHub / GitLab**.
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Configure Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. The included [`vercel.json`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/vercel.json) handles Single Page App routing:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Click **Deploy**. Vercel will build and assign your production domain.

---

### 5.2 Deploying on Cloudflare Pages

1. In the Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages**.
2. Connect your Git repository.
3. Configure build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add a `_redirects` file or enable SPA fallback to `index.html` for client-side routing.
5. Deploy.

---

### 5.3 Deploying on Netlify

1. In Netlify Dashboard, select **Add new site** > **Import an existing project**.
2. Choose your Git repository.
3. Build Settings:
   - **Base directory:** Leave empty (root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. For client-side routing, Netlify automatically respects SPA rewrites or a `public/_redirects` file containing:
   ```
   /*    /index.html   200
   ```
5. Deploy site.

---

## 6. Pre-Flight Production Checklist

Before public release, run through this verification checklist:

- [ ] **Build Validation:** `npm run build` completes with 0 errors and zero chunk size warnings.
- [ ] **SEO Metadata:** Verify title, meta descriptions, and OpenGraph images in `index.html` and `src/hooks/usePageMeta.js`.
- [ ] **Favicons & Manifest:** Ensure `public/site.webmanifest` and high-res icons are present.
- [ ] **Robots & Sitemap:** Verify `public/robots.txt` points to `https://realxr.in/sitemap.xml`.
- [ ] **404 Routing:** Ensure direct URL visits to `/projects`, `/gallery`, `/resources` route correctly to `index.html`.
- [ ] **60 FPS Performance:** Verify Lenis virtual scroll, WebGL fluid canvas, and 3D VR Headset run smoothly across mobile and desktop devices.
