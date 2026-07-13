// ── BlogsData.js ──────────────────────────────────────────────────
/**
 * BlogsData.js
 * Mock data contract mirroring a real CMS/API response.
 * Migration path: replace fetchBlogs / fetchBlogById with real API calls.
 * The shape stays identical — zero UI changes needed.
 **/

export const BLOG_CATEGORIES = [
  { id: "all", label: "All Posts" },
  { id: "tutorial", label: "Tutorials" },
  { id: "devlog", label: "Dev Logs" },
  { id: "research", label: "Research" },
  { id: "career", label: "Career & Growth" },
  { id: "events", label: "Event Recaps" },
  { id: "opinion", label: "Opinion" },
];

export const BLOGS = [
  {
    id: "getting-started-webxr",
    title: "Getting Started with WebXR in 2025",
    slug: "getting-started-webxr",
    category: "tutorial",
    author: { name: "Ubed Khan", role: "Web Dev Lead", avatar: "UK" },
    date: "2025-06-10",
    readTime: "8 min read",
    tags: ["WebXR", "Three.js", "JavaScript", "Browser API"],
    coverGradient: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
    coverEmoji: "🥽",
    excerpt:
      "A complete beginner's guide to building your first WebXR experience — from setting up a Three.js scene to deploying on a real headset.",
    content: `
## Introduction

WebXR has matured significantly in 2025. The Device API is now supported across all major browsers, Meta Quest ships with a Chromium-based browser that fully supports WebXR, and the performance gap between native and web XR has narrowed dramatically. This is the best time to start.

## Setting Up Your Project

Start with Vite — it gives you HMR, fast builds, and works great with Three.js.


## Creating Your First XR Session

The entry point to any WebXR experience is \\\`navigator.xr\\\`. You first check if immersive-vr is supported, then request a session.

\\\`\\\`\\\`javascript
const supported = await navigator.xr.isSessionSupported('immersive-vr');
if (supported) {
  const session = await navigator.xr.requestSession('immersive-vr');
}
\\\`\\\`\\\`

## Setting Up the Render Loop

WebXR replaces the standard requestAnimationFrame with XRSession.requestAnimationFrame, which gives you a frame object containing pose data.


## Next Steps

- Add controller input using XRInputSource
- Implement hit testing for AR surfaces  
- Explore React Three Fiber's XR integration via @react-three/xr
- Deploy to GitHub Pages — WebXR works on any HTTPS host

## Resources

- [MDN WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [Immersive Web Samples](https://immersive-web.github.io/webxr-samples/)
- [Three.js WebXR Examples](https://threejs.org/examples/?q=webxr)
    \`,
    featured: true,
  },
  {
    id: "gsap-scrolltrigger-masterclass",
    title: "GSAP ScrollTrigger: Building Awwwards-Level Scroll Animations",
    slug: "gsap-scrolltrigger-masterclass",
    category: "tutorial",
    author: { name: "Ubed Khan", role: "Web Dev Lead", avatar: "UK" },
    date: "2025-05-28",
    readTime: "12 min read",
    tags: ["GSAP", "ScrollTrigger", "Animation", "React"],
    coverGradient: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
    coverEmoji: "✨",
    excerpt: "Deep-dive into GSAP ScrollTrigger — pinning, scrubbing, horizontal scroll sections, and building video scrub effects that actually work with Lenis.",
    content: \`
## Why ScrollTrigger?

ScrollTrigger is the industry standard for scroll-driven animations. It's used by agencies like Active Theory, Unit9, and Instrument to build Awwwards-winning sites. The key insight: it ties animation progress directly to scroll position, enabling buttery smooth experiences.

## The Lenis + ScrollTrigger Setup

The most important step that most tutorials skip — you must drive Lenis via gsap.ticker, not requestAnimationFrame.

\\\`\\\`\\\`javascript
const lenis = new Lenis({ smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);

// Named function for clean cleanup
const tickerFn = (time) => lenis.raf(time * 1000);
gsap.ticker.add(tickerFn);
gsap.ticker.lagSmoothing(0);
\\\`\\\`\\\`

## Pinned Horizontal Scroll

\\\`\\\`\\\`javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    pin: true,
    start: 'top top',
    end: () => \\\`+=\\\${trackTravel}\\\`,
    scrub: 1,
    invalidateOnRefresh: true,
  }
});

tl.to(trackRef.current, { x: -trackTravel, ease: 'none' });
\\\`\\\`\\\`

## Video Scrub

The correct approach uses onUpdate rather than animating currentTime directly.

\\\`\\\`\\\`javascript
ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: \\\`+=\\\${duration * 500}\\\`,
  pin: true,
  onUpdate: (self) => {
    video.currentTime = self.progress * duration;
  }
});
\\\`\\\`\\\`

## Common Pitfalls

1. Never use overflow:hidden on a pinned section's parent
2. Always use invalidateOnRefresh: true for dynamic content
3. Kill ScrollTrigger instances on component unmount
4. Use anticipatePin: 1 to prevent jump-on-pin
    \`,
    featured: true,
  },
  {
    id: "hackathon-3-recap",
    title: "RealXR Hackathon 3.0 — What We Built and What We Learned",
    slug: "hackathon-3-recap",
    category: "events",
    author: { name: "Arjun Rao", role: "Club President", avatar: "AR" },
    date: "2025-05-15",
    readTime: "6 min read",
    tags: ["Hackathon", "Unity", "ARCore", "Community"],
    coverGradient: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
    coverEmoji: "⚡",
    excerpt: "24 hours. 80 builders. 20 teams. A full recap of our biggest hackathon yet — the winning projects, what surprised us, and what we're doing differently next time.",
    content: \`
## The Setup

On August 15–16, 2025, 80 participants descended on the Main Auditorium for RealXR Hackathon 3.0. This was our biggest event yet — double the participants of Hackathon 2.0, with six industry judges and a ₹50,000 prize pool.

## What Teams Built

The theme was "Spatial Chaos" — intentionally ambiguous to encourage creative interpretation.

**Winner: CampusAR (Team 7)**
An AR wayfinding app for IES IPS Academy that overlays navigation arrows, classroom info, and faculty availability in real-time using ARCore. The judges were impressed by the production polish — it actually worked on multiple Android devices without crashing.

**Runner-up: MindVault (Team 14)**
A VR meditation and stress-relief app built in Unity. Used spatialized audio and procedural environments to create calming experiences. The 3D artist on this team produced assets of professional quality in under 20 hours.

**Special Mention: GestureOS (Team 3)**
A hand-gesture-controlled UI framework using MediaPipe. You could control a full desktop interface without touching anything. Genuinely impressive and slightly terrifying.

## What Surprised Us

1. The quality of AR projects jumped dramatically — ARCore's SLAM has gotten much better
2. Three teams independently chose to use WebXR instead of native — the web has arrived
3. The biggest bottleneck wasn't coding — it was 3D asset creation

## What We're Changing for Hackathon 4.0

- Pre-hackathon 3D asset library available to all teams
- Dedicated hardware station with Quest 3 units for testing
- Mentors allocated per domain (AR, VR, WebXR, Game Dev)
- 36 hours instead of 24 — the best teams always need more time
    \`,
    featured: true,
  },
  {
    id: "blender-to-unity-pipeline",
    title: "The Complete Blender → Unity Asset Pipeline",
    slug: "blender-to-unity-pipeline",
    category: "tutorial",
    author: { name: "Amit Verma", role: "3D Artist", avatar: "AV" },
    date: "2025-05-02",
    readTime: "15 min read",
    tags: ["Blender", "Unity", "3D", "Game Dev", "FBX", "glTF"],
    coverGradient: "linear-gradient(135deg, #d97706 0%, #dc2626 100%)",
    coverEmoji: "🧊",
    excerpt: "The exact workflow for getting Blender models into Unity without the usual import headaches — normals, UV maps, materials, animations, and LODs all covered.",
    content: \`
## The Problem

Getting 3D assets from Blender to Unity sounds trivial. It isn't. Most beginners waste hours fighting flipped normals, broken materials, or animations that simply don't play. This guide eliminates all of that.

## File Format Choice

Use FBX for animated characters and rigged meshes. Use glTF/GLB for static props. Never use OBJ — it loses material data and doesn't support animations.

## Blender Export Settings

\\\`\\\`\\\`
Export > FBX
- Apply Scalings: FBX Units Scale  
- Forward: -Z Forward
- Up: Y Up
- Apply Unit: ✓
- Apply Transform: ✓ (critical — avoids scale 100 issue)
- Bake Animation: ✓ (for rigged characters)
\\\`\\\`\\\`

## Material Setup in Blender

Use Principled BSDF for everything. Unity's URP Standard shader maps to it 1:1.

- Base Color → Albedo
- Roughness → Smoothness (inverted)
- Metallic → Metallic
- Normal Map → Normal Map

## Unity Import Settings

After importing the FBX:
1. Set the Normals import mode to Calculate (not Import)
2. Set Smoothing Angle to 60°
3. Enable Read/Write for mesh if you need runtime modifications
4. For animated characters: enable Rig > Humanoid and fix any bone mapping issues

## LOD Setup

Always create 3 LOD levels for real-time XR applications:
- LOD0: Full poly (viewed < 5m)
- LOD1: 50% reduction (5–15m)
- LOD2: 75% reduction (15m+)

Use Blender's Decimate modifier for quick LODs.
    \`,
    featured: false,
  },
  {
    id: "ar-vs-vr-career-path",
    title: "AR vs VR Development in 2025 — Which Career Path Should You Choose?",
    slug: "ar-vs-vr-career-path",
    category: "career",
    author: { name: "Priya Krishnan", role: "Vice President", avatar: "PK" },
    date: "2025-04-20",
    readTime: "9 min read",
    tags: ["Career", "AR", "VR", "Industry", "Jobs"],
    coverGradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
    coverEmoji: "🚀",
    excerpt: "An honest breakdown of the AR vs VR job market, salaries, required skills, and which path makes more sense depending on your background and goals.",
    content: \`
## The Market Reality

The XR job market in 2025 has bifurcated clearly. AR development — particularly for mobile (ARKit, ARCore) and enterprise (HoloLens, Magic Leap) — has the larger job pool. VR development is more specialized but commands higher salaries in gaming and simulation.

## AR Development Path

**Who it's for:** Mobile developers, Unity devs, engineers who enjoy solving real-world computer vision problems.

**Core skills needed:**
- ARKit (iOS) or ARCore (Android)
- Unity with AR Foundation
- Computer vision basics (SLAM, feature detection)
- 3D math (quaternions, matrices, raycasting)

**Job market:** Large and growing. Every major tech company is hiring AR engineers. Meta, Apple, Google, Snap, Niantic all have dedicated AR teams. Median salary in India: ₹18–35 LPA.

## VR Development Path

**Who it's for:** Game developers, simulation engineers, training application builders.

**Core skills needed:**
- Unity or Unreal Engine (deep)
- OpenXR / Meta XR SDK
- Performance optimization for 90fps rendering
- UX design for spatial interfaces

**Job market:** Smaller but premium. Gaming studios, enterprise training companies, architectural visualization firms. Median salary in India: ₹20–40 LPA for senior roles.

## My Recommendation

**If you're starting out:** Go AR first. The learning curve is gentler, the job market is bigger, and skills transfer to VR easily. Mobile AR is also accessible — you don't need expensive hardware.

**If you have Unity/Unreal experience:** Go VR. Your existing skills compound quickly and the premium salary band is worth the narrower job pool.

**The wildcard:** WebXR. Browser-based XR is exploding. React Three Fiber + @react-three/xr gives you access to both AR and VR from a web stack. The job market here is early but the ceiling is high.
    \`,
    featured: false,
  },
  {
    id: "gaussian-splatting-intro",
    title: "3D Gaussian Splatting: The End of NeRF?",
    slug: "gaussian-splatting-intro",
    category: "research",
    author: { name: "Rohan Mehta", role: "Technical Director", avatar: "RM" },
    date: "2025-04-08",
    readTime: "11 min read",
    tags: ["3DGS", "NeRF", "Research", "3D Reconstruction", "AI"],
    coverGradient: "linear-gradient(135deg, #0f172a 0%, #7c3aed 100%)",
    coverEmoji: "🔬",
    excerpt: "3D Gaussian Splatting achieved real-time NeRF-quality novel view synthesis in 2023. Two years later, it's reshaping how we think about photorealistic AR/VR content creation.",
    content: \`
## What is 3D Gaussian Splatting?

3DGS represents a scene as millions of tiny 3D Gaussians — each with a position, orientation, scale, opacity, and colour defined by spherical harmonics. Rather than querying a neural network per ray (like NeRF), rendering is done by projecting and alpha-blending these Gaussians in 2D.

The result: photorealistic quality at 100+ FPS on consumer GPUs. NeRF typically renders at < 1 FPS for comparable scenes.

## How It Works

1. **Input:** 30–200 photos of a scene taken from multiple angles
2. **SfM initialization:** Structure from Motion (COLMAP) extracts camera poses and a sparse point cloud
3. **Gaussian initialization:** Each SfM point becomes a starting Gaussian
4. **Training:** Gaussians are optimized (position, covariance, opacity, SH coefficients) via gradient descent using photometric loss
5. **Rendering:** Gaussians are sorted by depth, projected to 2D, and alpha-blended

## Why It Matters for XR

For AR/VR, 3DGS solves a long-standing problem: realistic, real-time rendering of captured real-world scenes.

- **Digital twins:** Scan a real room in 20 minutes, render it in VR at 90fps
- **Object capture:** Scan a physical object, drop it into an AR scene with photorealistic quality
- **Set extensions:** Replace a green screen with a 3DGS scene captured on location

## Current Limitations

- File sizes are large (50MB–500MB for complex scenes)
- Dynamic scenes (people, moving objects) remain unsolved
- Real-time compression is an active research area
- Not yet supported natively in WebXR (though converters exist)

## The Ecosystem in 2025

- **Luma AI:** Best mobile capture app, exports to glTF/USDZ/splat
- **Polycam:** Multi-format scanner including 3DGS mode
- **Unity 6 Gaussian Splat Plugin:** Official plugin in preview
- **Three.js gaussian-splatting library:** Community implementation for WebXR
    \`,
    featured: true,
  },
  {
    id: "mediapipe-gesture-control",
    title: "Building a Gesture-Controlled UI with MediaPipe and React",
    slug: "mediapipe-gesture-control",
    category: "tutorial",
    author: { name: "Ubed Khan", role: "Web Dev Lead", avatar: "UK" },
    date: "2025-03-25",
    readTime: "14 min read",
    tags: ["MediaPipe", "Gesture Recognition", "React", "Computer Vision", "AI"],
    coverGradient: "linear-gradient(135deg, #065f46 0%, #0891b2 100%)",
    coverEmoji: "🖐",
    excerpt: "Step-by-step guide to building a hands-free interface using MediaPipe Hand Landmarker in a React app — detect gestures, map them to actions, and handle the performance pitfalls.",
    content: \`
## What We're Building

A React app where you can control UI elements (click, scroll, navigate) using hand gestures detected by your webcam. No backend required — MediaPipe runs entirely in the browser via WebAssembly.

## Setup

\\\`\\\`\\\`bash
npm install @mediapipe/tasks-vision
\\\`\\\`\\\`

## Initializing HandLandmarker

\\\`\\\`\\\`javascript
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const filesetResolver = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  },
  runningMode: "VIDEO",
  numHands: 1,
});
\\\`\\\`\\\`

## Detecting Gestures

MediaPipe returns 21 landmarks per hand. We use the relative positions to detect gestures.

\\\`\\\`\\\`javascript
// Pinch gesture: thumb tip (4) close to index tip (8)
const isPinching = (landmarks) => {
  const thumb = landmarks[4];
  const index = landmarks[8];
  const dist = Math.hypot(thumb.x - index.x, thumb.y - index.y);
  return dist < 0.05; // threshold in normalized coords
};
\\\`\\\`\\\`

## Performance Considerations

1. Run detection in a Web Worker to avoid blocking the main thread
2. Throttle detection to 30fps even if your camera runs at 60fps
3. Use runningMode: VIDEO not IMAGE — it enables temporal smoothing
4. Debounce gesture events (300ms) to prevent accidental triggers

## React Integration

\\\`\\\`\\\`javascript
const useHandGesture = (onPinch, onSwipe) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const detect = async () => {
      const result = handLandmarker.detectForVideo(videoRef.current, Date.now());
      if (result.landmarks.length > 0) {
        if (isPinching(result.landmarks[0])) onPinch?.();
      }
      requestAnimationFrame(detect);
    };
    detect();
  }, []);
  
  return videoRef;
};
\\\`\\\`\\\`
    \`,
    featured: false,
  },
  {
    id: "realxr-website-devlog",
    title: "Building the RealXR Website: A Three.js + GSAP Dev Log",
    slug: "realxr-website-devlog",
    category: "devlog",
    author: { name: "Ubed Khan", role: "Web Dev Lead", avatar: "UK" },
    date: "2025-03-10",
    readTime: "18 min read",
    tags: ["React", "Three.js", "GSAP", "Lenis", "Dev Log"],
    coverGradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    coverEmoji: "⚙️",
    excerpt: "The complete behind-the-scenes of building the RealXR club website — the tech decisions, the bugs, the GSAP pin nightmares, and everything we'd do differently.",
    content: \`
## Why We Built It From Scratch

Most college club websites are WordPress themes with stock photos. We wanted something that looked like it belonged on Awwwards. So we built it ourselves, in React, with Three.js, GSAP, and a fluid shader background.

## The Stack Decision

After evaluating Next.js, Astro, and plain React, we chose React with Vite because:
- We needed complex GSAP ScrollTrigger integrations that fought with SSR
- The WebGL background (R3F) doesn't work server-side without hacks
- Vite's dev experience is faster than Next.js for animation-heavy work

## The Fluid Shader Background

The background is a GLSL fragment shader running on a full-screen Three.js canvas. It's position:fixed behind everything, driven by mouse position via a smooth lerp.

The key insight: the shader only needs 2 uniforms — mouse position and time. Everything else (color, distortion, velocity) is computed in GLSL. This keeps it at ~0.5ms per frame.

## The Lenis + ScrollTrigger Integration

This took the most debugging. The critical rule: Lenis must be driven via gsap.ticker, not requestAnimationFrame. We spent two days tracking down why pin sections were disappearing — it was a double-initialized Lenis instance.

## What We'd Do Differently

1. **Move data to a CMS early** — hardcoded team members were painful to update
2. **Use Tailwind for layout, inline styles for animations** — never mix the two
3. **Break sections into smaller files sooner** — Hero.jsx became 400 lines
4. **Test on real devices weekly** — mobile performance issues caught late are expensive
5. **Use gsap.context() from day 1** — retrofitting it was painful

## Performance Numbers

- First Contentful Paint: 0.8s (preloader hides this)
- Largest Contentful Paint: 1.4s
- CLS: 0 (aspect-ratio containers on all media)
- FPS during scrolling: 60fps on 2020+ hardware, 30fps on integrated graphics

## Open Source?

We're considering open-sourcing the template after we remove college-specific data. Watch our GitHub.
    \`,
    featured: false,
  },
  {
    id: "unity-xr-interaction-tips",
    title: "10 Unity XR Interaction Patterns That Feel Natural",
    slug: "unity-xr-interaction-tips",
    category: "tutorial",
    author: { name: "Nisha Sharma", role: "Design Lead", avatar: "NS" },
    date: "2025-02-22",
    readTime: "10 min read",
    tags: ["Unity", "XR", "UX", "VR", "Interaction Design"],
    coverGradient: "linear-gradient(135deg, #dc2626 0%, #9333ea 100%)",
    coverEmoji: "🤲",
    excerpt: "The difference between a frustrating VR experience and a magical one comes down to interaction design. Here are 10 patterns that make virtual objects feel real.",
    content: \`
## Why Interaction Design Matters More in VR

In 2D interfaces, users tolerate imprecise controls — we've trained ourselves to work around them. In VR, the moment something feels wrong, presence collapses. The 5ms latency in Quest 3's hand tracking is below human perception threshold. Our job is to design interactions that feel as natural as the hardware allows.

## Pattern 1: Snap and Highlight

Never make users aim precisely for small objects. Add a magnetic snap zone that activates when the hand is within a radius.

\\\`\\\`\\\`csharp
void Update() {
    float dist = Vector3.Distance(handPosition, transform.position);
    if (dist < snapRadius) {
        Highlight(true);
        // Show a ghost at the grab point
        ghost.SetActive(true);
    }
}
\\\`\\\`\\\`

## Pattern 2: Haptic Feedback is Non-Negotiable

Every grab, collision, and button press needs haptic feedback. Even a 20ms vibration at 0.1 amplitude makes interactions feel grounded.

## Pattern 3: Don't Make Users Reach

Objects further than arm's length should use ray casting + wrist flick to retrieve, not physical reach. Physical reach breaks presence when virtual arms extend past real arm length.

## Pattern 4: Scale Cues Before Grab

Show a scale outline of the object in the user's hand before they commit to grabbing. Users decide "does this fit my hand?" before reaching — honour that mental model.

## Pattern 5: Inertia on Release

Objects should retain velocity when released. A book dropped from 1m should fall with gravity. A thrown ball should arc. Use Rigidbody velocity inheritance from the XR Grab Interactable.

## Pattern 6: Two-Handed Operations Feel Weighty

Use two-handed grabs for heavy objects. The XR Interaction Toolkit supports this natively. Adding a slight lag/resistance to two-handed movement (vs. snappy one-handed) communicates mass.

## Pattern 7: Audio-First Feedback

Sound precedes visual feedback in human perception. UI sounds should trigger 1 frame before visual state changes. This makes buttons feel faster than they are.

## Pattern 8: Comfort Vignettes

On locomotion, add a subtle peripheral vignette (darken edges) to reduce motion sickness. The sweet spot is 15–20% opacity vignette triggered by controller movement.

## Pattern 9: Tutorial Ghosts

Show a semi-transparent "ghost" hand demonstrating the correct gesture for 3 seconds when users are stuck. More effective than text instructions.

## Pattern 10: Break Physics Deliberately

The best VR interactions strategically break physics for comfort. A sword that can pass through geometry below knee height prevents frustrating crouching. A door that swings slightly faster than physically correct feels more satisfying. Optimize for feel, not simulation accuracy.
    \`,
    featured: false,
  },
  {
    id: "fresher-xr-roadmap",
    title: "The Fresher's 6-Month XR Development Roadmap",
    slug: "fresher-xr-roadmap",
    category: "career",
    author: { name: "Priya Krishnan", role: "Vice President", avatar: "PK" },
    date: "2025-02-05",
    readTime: "7 min read",
    tags: ["Career", "Roadmap", "Beginner", "XR", "Learning"],
    coverGradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    coverEmoji: "🗺️",
    excerpt: "A structured 6-month plan to go from zero to your first XR project — week by week, with specific resources, mini-projects, and milestone checkpoints.",
    content: \`
## Month 1: Foundations

**Week 1–2: 3D Math**
You cannot do XR without 3D math. Spend two weeks on vectors, dot products, cross products, matrices, and quaternions. 3Blue1Brown's Essence of Linear Algebra on YouTube is the best resource.

**Week 3–4: Unity Basics**
Complete Unity's "Create with Code" official course (free). Don't skip it — bad Unity habits are hard to unlearn.

**Milestone:** Build a simple scene where you can pick up objects.

## Month 2: Your First AR App

**Week 5–6: AR Foundation**
Install AR Foundation in Unity. Follow the official AR Foundation Samples repository step by step.

**Week 7–8: Your First Project**
Build a simple AR ruler — place two anchors and measure the distance between them. Sounds simple, harder than it sounds.

**Milestone:** A working AR app on your Android phone.

## Month 3: VR

**Week 9–10: XR Interaction Toolkit**
Take Unity's official XR Interaction Toolkit course on Unity Learn.

**Week 11–12: Complete a Game Jam**
Join a VR game jam on itch.io. Ship something, even if it's bad.

**Milestone:** A complete VR mini-game you can hand to someone and they'll enjoy.

## Month 4: Web XR

**Week 13–14: Three.js Journey (first 20 lessons)**
Three.js Journey by Bruno Simon. Pay for it — it's worth every rupee.

**Week 15–16: React Three Fiber**
Build a 3D portfolio using R3F. This teaches you how 3D and React integrate.

**Milestone:** A live WebXR demo you can share via a URL.

## Month 5: Specialization

Choose one: AR, VR, or WebXR. Go deep. Build a portfolio-quality project.

## Month 6: Portfolio + Applications

**Week 21–22: Document your work**
Write case studies. Record demos. Create a GitHub README for each project.

**Week 23–24: Apply**
Target game studios, AR startups, enterprise VR companies, and XR consultancies. Apply broadly — the market is smaller than frontend but salaries are higher.

## The Most Important Advice

Ship before you're ready. Every developer I know who found a job in XR has projects that embarrass them. That's the cost of learning in public. The developers who wait until their work is perfect never ship anything.
    \`,
    featured: true,
  },
  {
    id: "apple-vision-pro-web",
    title: "Building for Apple Vision Pro: A Web Developer's Perspective",
    slug: "apple-vision-pro-web",
    category: "opinion",
    author: { name: "Ubed Khan", role: "Web Dev Lead", avatar: "UK" },
    date: "2025-01-20",
    readTime: "8 min read",
    tags: ["Apple Vision Pro", "visionOS", "WebXR", "Safari"],
    coverGradient: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    coverEmoji: "🍎",
    excerpt: "Six months after getting access to an Apple Vision Pro unit, here's an honest take on what works, what doesn't, and whether web developers should care yet.",
    content: \`
## The Hardware is Genuinely Different

I'll say this upfront: the Apple Vision Pro is not just a better Quest. The display density (23 million pixels per eye), the eye + hand + voice input system, and the passthrough quality are all in a different class. This is not incremental improvement.

## WebXR on Vision Pro: The Reality

Safari on visionOS supports WebXR via the Immersive Web specification, but with caveats:

**What works:**
- WebXR Viewer sessions (non-immersive 3D in a 2D window)
- Standard WebGL rendering
- Spatial web experiences using CSS transforms

**What doesn't work yet:**
- Full immersive-vr sessions (in Safari, as of early 2025)
- Hand tracking via WebXR (different API surface than Quest)
- Passthrough AR via WebXR

## The Opportunity: Spatial Web

Where visionOS gets interesting for web developers is the concept of windows in space. Your standard React app renders in a floating window. You can use CSS to create layered depth. The DOM is rendered as a spatial surface.

\\\`\\\`\\\`css
/* This actually works on Vision Pro */
.card {
  transform: translateZ(50px);
  backdrop-filter: blur(20px);
}
\\\`\\\`\\\`

## Should Web Developers Care Yet?

Honestly: not urgently. The Vision Pro market is tiny (sub-1M units). WebXR support is incomplete. Swift/SwiftUI/RealityKit is the correct development path for serious visionOS applications.

But watch it closely. When Apple supports full immersive WebXR (which they will), the spatial web will be the fastest way to ship XR experiences across Quest, Vision Pro, and desktop simultaneously.

## My Prediction

By end of 2026: Full WebXR support in Safari. Apple's own Reality Composer Pro will export directly to WebXR-compatible format. The spatial web becomes the default for consumer-facing XR experiences. Native apps retain their position in gaming and enterprise.
    \`,
    featured: false,
  },
  {
    id: "realxr-blender-bootcamp-recap",
    title: "Blender Bootcamp — What 40 Students Built in 3 Days",
    slug: "realxr-blender-bootcamp-recap",
    category: "events",
    author: { name: "Amit Verma", role: "3D Artist", avatar: "AV" },
    date: "2025-01-08",
    readTime: "5 min read",
    tags: ["Blender", "Bootcamp", "Event", "3D Modelling", "Community"],
    coverGradient: "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
    coverEmoji: "🎨",
    excerpt: "A full recap of our 3-day Blender Bootcamp — 40 participants, zero prior 3D experience required, and every single one shipped a game-ready asset.",
    content: \`
## The Goal

Every student leaves with one game-ready 3D asset they made themselves. That was the only success metric. Not understanding every node in the shader editor. Not being able to rig a character. One complete, exportable asset.

## Day 1: From Zero to Mesh

We spent Day 1 entirely on mesh modelling. No shaders, no rigging, no rendering — just building the geometry.

Students chose their object from a provided list (chair, mug, sword, helmet, phone) so we could provide reference sheets. The constraint helped — open-ended projects stall at this level.

By the end of Day 1, every student had a closed, manifold mesh with correct normals.

## Day 2: UV Unwrapping + Texturing

The trickiest session. UV unwrapping is the step where most beginner tutorials skip or rush through. We spent 3 hours on it alone.

We used Blender's Smart UV Project as a starting point, then manually fixed obvious stretching. For texturing, we used Substance Painter (Adobe provided free educational licenses) rather than Blender's shader editor — Substance is more widely used in industry.

## Day 3: Lighting, Rendering, Export

Final day: Blender's Cycles renderer for the final portfolio render, then FBX/GLB export with all texture maps packed.

Every student rendered their final image and exported their asset. All 40 shipped.

## What We Learned as Instructors

1. Reference images are non-negotiable — "draw a chair from memory" fails every time
2. The UV unwrap session needs more time in future bootcamps
3. Having a help Discord channel active during the bootcamp reduced blocking questions by 70%
4. Pairing students (one stronger, one weaker) accelerated learning without slowing the stronger student

## The Assets

All 40 student assets are available in our Google Drive, free to use in any RealXR project. Filter by category (furniture, weapons, everyday objects, architecture). Quality ranges from "pretty good for 3 days" to "genuinely impressive."
    `,
    featured: false,
  },
];

// ── Mock API — replace implementation with real fetch when backend is ready ──

export const fetchBlogs = async ({
  query = "",
  page = 1,
  perPage = 10,
  category = "all",
} = {}) => {
  await new Promise((r) => setTimeout(r, 100)); // simulate latency

  let results = [...BLOGS];

  if (category !== "all") {
    results = results.filter((b) => b.category === category);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.author.name.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  const total = results.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = results.slice(start, start + perPage);

  return { data, total, totalPages, page, perPage };
};

export const fetchBlogById = async (id) => {
  await new Promise((r) => setTimeout(r, 80));
  return BLOGS.find((b) => b.id === id) ?? null;
};
