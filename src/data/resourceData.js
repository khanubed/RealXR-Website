// ── ResourcesData.js ──────────────────────────────────────────────
/**
 * ResourcesData.js
 * Mock data contract — mirrors a real API response shape.
 * When backend is ready, replace this with:
 *   export const fetchResources = async (query, page, filters) => {
 *     const res = await fetch(\`/api/resources?q=\${query}&page=\${page}&category=\${filters.category}\`);
 *     return res.json(); // same shape as RESOURCES_DATA below
 *   }
 */

export const CATEGORIES = [
  { id: "all",        label: "All Resources" },
  { id: "webxr",      label: "WebXR" },
  { id: "unity",      label: "Unity" },
  { id: "unreal",     label: "Unreal Engine" },
  { id: "blender",    label: "Blender & 3D" },
  { id: "arkit",      label: "ARKit / ARCore" },
  { id: "shaders",    label: "Shaders & GLSL" },
  { id: "ai-xr",      label: "AI + XR" },
  { id: "papers",     label: "Research Papers" },
  { id: "tools",      label: "Tools & SDKs" },
];

export const RESOURCE_TYPES = {
  article:   { label: "Article",    color: "#ec4899" },
  video:     { label: "Video",      color: "#8b5cf6" },
  course:    { label: "Course",     color: "#06b6d4" },
  tool:      { label: "Tool",       color: "#10b981" },
  paper:     { label: "Paper",      color: "#f59e0b" },
  repo:      { label: "Repository", color: "#3b82f6" },
  docs:      { label: "Docs",       color: "#6366f1" },
};

export const RESOURCES_DATA = [
  {
    id: "r-001",
    title: "Introduction to WebXR Device API",
    category: "webxr",
    type: "docs",
    author: "MDN Web Docs",
    date: "2024-10-01",
    readTime: "12 min read",
    difficulty: "Beginner",
    tags: ["WebXR", "JavaScript", "Browser API"],
    excerpt: "Comprehensive guide to the WebXR Device API for creating immersive augmented and virtual reality experiences directly in the browser.",
    description: "The WebXR Device API provides access to input and output capabilities commonly associated with Virtual Reality (VR) and Augmented Reality (AR) devices. It lets you detect available XR hardware, poll for input device state, present imagery at the appropriate frame rate, and manage reference spaces. This guide walks through everything from session setup to rendering loops.",
    links: [
      { label: "Read on MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API", primary: true },
      { label: "GitHub Examples", url: "https://github.com/immersive-web/webxr-samples", primary: false },
    ],
    stars: 4.8,
    saves: 342,
    featured: true,
  },
  {
    id: "r-002",
    title: "Unity XR Interaction Toolkit — Complete Course",
    category: "unity",
    type: "course",
    author: "Unity Learn",
    date: "2024-08-15",
    readTime: "6 hours",
    difficulty: "Intermediate",
    tags: ["Unity", "XR", "C#", "Interaction"],
    excerpt: "Build complete VR interaction systems using Unity's XR Interaction Toolkit — grab, teleport, ray interactors, and more.",
    description: "This comprehensive course covers the Unity XR Interaction Toolkit from the ground up. Learn to build fully interactive VR experiences with grab interactors, socket interactors, teleportation systems, and custom haptic feedback. Suitable for developers who already know Unity basics and want to specialize in XR development.",
    links: [
      { label: "Start Course", url: "https://learn.unity.com/", primary: true },
      { label: "Documentation", url: "https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@3.0/manual/index.html", primary: false },
    ],
    stars: 4.9,
    saves: 891,
    featured: true,
  },
  {
    id: "r-003",
    title: "Three.js Journey — The Ultimate WebGL & Three.js Course",
    category: "webxr",
    type: "course",
    author: "Bruno Simon",
    date: "2024-06-01",
    readTime: "70+ hours",
    difficulty: "Beginner to Advanced",
    tags: ["Three.js", "WebGL", "JavaScript", "GLSL"],
    excerpt: "The most complete Three.js course on the internet. 70+ hours of content covering everything from basic scenes to post-processing and shaders.",
    description: "Three.js Journey is widely considered the gold standard for learning WebGL and Three.js. Bruno Simon walks through every aspect of 3D web development — geometry, materials, lighting, shadows, physics, particles, shaders (GLSL), post-processing, React Three Fiber, and much more. Used by developers at top companies worldwide.",
    links: [
      { label: "Visit Course", url: "https://threejs-journey.com/", primary: true },
      { label: "Bruno's Portfolio", url: "https://bruno-simon.com/", primary: false },
    ],
    stars: 5.0,
    saves: 2041,
    featured: true,
  },
  {
    id: "r-004",
    title: "Blender 4.0 Complete Beginner's Guide",
    category: "blender",
    type: "video",
    author: "Blender Guru",
    date: "2024-03-20",
    readTime: "8 hours",
    difficulty: "Beginner",
    tags: ["Blender", "3D Modelling", "Animation"],
    excerpt: "The definitive beginner series for Blender 4.0. Start with the legendary donut tutorial and build up to complete scene creation.",
    description: "Blender Guru's donut tutorial series is the most-watched Blender beginner series in history. Updated for Blender 4.0, this series covers the entire workflow from installation to rendering your first complete project. Topics include mesh modelling, sculpting, shading, lighting, animation, and final render output.",
    links: [
      { label: "Watch on YouTube", url: "https://www.youtube.com/blenderguru", primary: true },
      { label: "Download Blender", url: "https://www.blender.org/download/", primary: false },
    ],
    stars: 4.9,
    saves: 1234,
    featured: false,
  },
  {
    id: "r-005",
    title: "ARCore Fundamentals — Building AR Android Apps",
    category: "arkit",
    type: "docs",
    author: "Google Developers",
    date: "2024-09-10",
    readTime: "3 hours",
    difficulty: "Intermediate",
    tags: ["ARCore", "Android", "Java", "Kotlin"],
    excerpt: "Official Google documentation and codelabs for building Augmented Reality Android applications using ARCore.",
    description: "ARCore is Google's platform for building augmented reality experiences on Android. This resource covers the four core concepts: Motion Tracking, Environmental Understanding, Light Estimation, and Augmented Faces. Includes step-by-step codelabs, sample apps, and best practices for production AR applications.",
    links: [
      { label: "ARCore Docs", url: "https://developers.google.com/ar", primary: true },
      { label: "Codelabs", url: "https://codelabs.developers.google.com/?cat=ar", primary: false },
      { label: "GitHub Samples", url: "https://github.com/google-ar/arcore-android-sdk", primary: false },
    ],
    stars: 4.6,
    saves: 567,
    featured: false,
  },
  {
    id: "r-006",
    title: "The Book of Shaders",
    category: "shaders",
    type: "article",
    author: "Patricio Gonzalez Vivo & Jen Lowe",
    date: "2023-01-01",
    readTime: "Self-paced",
    difficulty: "Intermediate",
    tags: ["GLSL", "Shaders", "Fragment Shaders", "Math"],
    excerpt: "A gentle step-by-step guide through the abstract and complex universe of Fragment Shaders. Interactive, free, and legendary.",
    description: "The Book of Shaders is an acclaimed interactive guide to GLSL fragment shaders. It's self-paced, contains editable live code examples, and progressively builds your understanding of mathematical concepts behind GPU programming. Covers algorithmic art, noise functions, patterns, image processing, and simulation. Essential reading for any graphics programmer.",
    links: [
      { label: "Read Online (Free)", url: "https://thebookofshaders.com/", primary: true },
    ],
    stars: 5.0,
    saves: 1876,
    featured: true,
  },
  {
    id: "r-007",
    title: "Unreal Engine 5 for Beginners — Complete Course",
    category: "unreal",
    type: "video",
    author: "Unreal Sensei",
    date: "2024-05-12",
    readTime: "12 hours",
    difficulty: "Beginner",
    tags: ["Unreal Engine 5", "Blueprints", "Game Dev"],
    excerpt: "Complete beginner's guide to Unreal Engine 5 covering Blueprints, Lumen, Nanite, and building your first complete game.",
    description: "This comprehensive course introduces Unreal Engine 5's groundbreaking features including Lumen dynamic global illumination, Nanite virtualized geometry, and the visual scripting system Blueprints. You'll build a complete game from scratch while learning the UE5 editor, asset pipeline, level design, and basic C++ integration.",
    links: [
      { label: "Watch Free", url: "https://www.youtube.com/@UnrealSensei", primary: true },
      { label: "Unreal Docs", url: "https://docs.unrealengine.com/5.0/en-US/", primary: false },
    ],
    stars: 4.8,
    saves: 723,
    featured: false,
  },
  {
    id: "r-008",
    title: "MediaPipe Hands — Real-time Hand Tracking",
    category: "ai-xr",
    type: "tool",
    author: "Google",
    date: "2024-04-01",
    readTime: "2 hours",
    difficulty: "Intermediate",
    tags: ["MediaPipe", "Computer Vision", "AI", "Gesture"],
    excerpt: "MediaPipe Hands provides high-fidelity hand and finger tracking by employing ML to infer 21 3D hand-knuckle coordinates from a single frame.",
    description: "MediaPipe Hands is a lightweight ML solution for high-fidelity hand and finger tracking. It uses a two-stage pipeline: a palm detector followed by a hand landmark model. Detects 21 3D landmarks per hand, runs in real-time on mobile and web, and is available in Python, JavaScript, and Android/iOS. Perfect for building gesture-controlled XR interfaces.",
    links: [
      { label: "MediaPipe Docs", url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker", primary: true },
      { label: "JS Demo", url: "https://mediapipe-studio.webapps.google.com/", primary: false },
      { label: "GitHub", url: "https://github.com/google-ai-edge/mediapipe", primary: false },
    ],
    stars: 4.7,
    saves: 445,
    featured: false,
  },
  {
    id: "r-009",
    title: "GSAP ScrollTrigger — Advanced Techniques",
    category: "webxr",
    type: "article",
    author: "GreenSock",
    date: "2024-07-01",
    readTime: "45 min read",
    difficulty: "Advanced",
    tags: ["GSAP", "ScrollTrigger", "Animation", "JavaScript"],
    excerpt: "Deep dive into GSAP ScrollTrigger — pin sections, scrub animations, horizontal scrolling, video scrubbing and more.",
    description: "This official GreenSock guide covers advanced ScrollTrigger patterns used by top creative agencies worldwide. Learn to build pinned horizontal scroll sections, scrub-based video playback, staggered reveal animations tied to scroll position, and complex multi-trigger compositions. Includes CodePen examples for every concept.",
    links: [
      { label: "Read Guide", url: "https://gsap.com/scroll/", primary: true },
      { label: "GSAP Docs", url: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/", primary: false },
    ],
    stars: 4.9,
    saves: 1102,
    featured: true,
  },
  {
    id: "r-010",
    title: "Reality Composer Pro — Spatial Computing for visionOS",
    category: "arkit",
    type: "tool",
    author: "Apple Developer",
    date: "2024-06-15",
    readTime: "4 hours",
    difficulty: "Intermediate",
    tags: ["visionOS", "Apple Vision Pro", "Reality Composer", "Swift"],
    excerpt: "Apple's professional spatial authoring tool for creating immersive visionOS apps with 3D scenes, physics, and RealityKit.",
    description: "Reality Composer Pro is Apple's dedicated tool for building spatial computing experiences for Apple Vision Pro. Create complex 3D scenes with physics simulations, particle effects, audio, and custom shaders. Integrates directly with Xcode and SwiftUI for complete visionOS app development. Includes USDZ support and collaborative workflows.",
    links: [
      { label: "Apple Docs", url: "https://developer.apple.com/documentation/visionos", primary: true },
      { label: "WWDC Sessions", url: "https://developer.apple.com/videos/visionos/", primary: false },
    ],
    stars: 4.5,
    saves: 334,
    featured: false,
  },
  {
    id: "r-011",
    title: "NeRF: Representing Scenes as Neural Radiance Fields",
    category: "papers",
    type: "paper",
    author: "Mildenhall et al. (ECCV 2020)",
    date: "2020-03-19",
    readTime: "Research Paper",
    difficulty: "Advanced",
    tags: ["NeRF", "Neural Networks", "3D Reconstruction", "Research"],
    excerpt: "The landmark paper introducing Neural Radiance Fields — a method for synthesizing novel views of complex scenes using a fully connected neural network.",
    description: "This seminal paper introduced NeRF (Neural Radiance Field), a method that represents a scene using a continuous volumetric scene function. The network inputs a 5D coordinate (location + viewing direction) and outputs volume density and view-dependent emitted radiance. Enables photorealistic novel view synthesis and has spawned an entire research area in 3D AI.",
    links: [
      { label: "Read Paper (arXiv)", url: "https://arxiv.org/abs/2003.08934", primary: true },
      { label: "Project Page", url: "https://www.matthewtancik.com/nerf", primary: false },
      { label: "GitHub Code", url: "https://github.com/bmild/nerf", primary: false },
    ],
    stars: 5.0,
    saves: 2890,
    featured: true,
  },
  {
    id: "r-012",
    title: "React Three Fiber — 3D in React",
    category: "webxr",
    type: "docs",
    author: "Pmndrs",
    date: "2024-09-01",
    readTime: "3 hours",
    difficulty: "Intermediate",
    tags: ["React Three Fiber", "Three.js", "React", "3D"],
    excerpt: "React Three Fiber is a React renderer for Three.js. Build 3D scenes using React components, hooks, and Suspense.",
    description: "React Three Fiber (R3F) is a React renderer for Three.js that lets you build complex 3D scenes declaratively using React. Everything in Three.js is available as a JSX component. Pairs with Drei (utilities), Rapier (physics), and Postprocessing for a complete 3D stack. Actively maintained by Pmndrs with a large community.",
    links: [
      { label: "Documentation", url: "https://docs.pmnd.rs/react-three-fiber", primary: true },
      { label: "Examples", url: "https://docs.pmnd.rs/react-three-fiber/getting-started/examples", primary: false },
      { label: "GitHub", url: "https://github.com/pmndrs/react-three-fiber", primary: false },
    ],
    stars: 4.9,
    saves: 1567,
    featured: false,
  },
  {
    id: "r-013",
    title: "Substance Painter — Game Asset Texturing Masterclass",
    category: "blender",
    type: "course",
    author: "Stylized Station",
    date: "2024-02-10",
    readTime: "10 hours",
    difficulty: "Intermediate",
    tags: ["Substance Painter", "Texturing", "PBR", "Game Assets"],
    excerpt: "Professional game asset texturing workflow using Adobe Substance Painter — PBR materials, baking, and export for Unity/Unreal.",
    description: "Learn the complete professional texturing pipeline for game assets using Adobe Substance Painter. This masterclass covers UV unwrapping best practices, mesh baking, PBR material creation, smart materials, procedural generators, and final export for Unity, Unreal Engine, and glTF. Trusted workflow used in the game industry.",
    links: [
      { label: "Watch Course", url: "https://www.stylizedstation.com/", primary: true },
      { label: "Substance Docs", url: "https://helpx.adobe.com/substance-3d-painter/home.html", primary: false },
    ],
    stars: 4.7,
    saves: 621,
    featured: false,
  },
  {
    id: "r-014",
    title: "A-Frame — Web Framework for Building Virtual Reality",
    category: "webxr",
    type: "tool",
    author: "Mozilla XR",
    date: "2024-01-15",
    readTime: "2 hours",
    difficulty: "Beginner",
    tags: ["A-Frame", "WebXR", "VR", "HTML"],
    excerpt: "A-Frame is an open-source web framework for building virtual reality experiences. Build VR with just HTML tags.",
    description: "A-Frame makes WebXR development accessible to web developers using familiar HTML-like markup. Built on top of Three.js and WebXR API, it provides an entity-component architecture, a rich component ecosystem, and support for all major VR headsets. Includes the A-Frame Inspector for live in-browser scene editing.",
    links: [
      { label: "A-Frame Docs", url: "https://aframe.io/", primary: true },
      { label: "Examples", url: "https://aframe.io/aframe/examples/", primary: false },
    ],
    stars: 4.5,
    saves: 789,
    featured: false,
  },
  {
    id: "r-015",
    title: "Gaussian Splatting — Real-time Novel View Synthesis",
    category: "papers",
    type: "paper",
    author: "Kerbl et al. (SIGGRAPH 2023)",
    date: "2023-08-10",
    readTime: "Research Paper",
    difficulty: "Advanced",
    tags: ["Gaussian Splatting", "3DGS", "Radiance Fields", "Research"],
    excerpt: "3D Gaussian Splatting for Real-Time Radiance Field Rendering — a breakthrough in real-time novel view synthesis surpassing NeRF in speed.",
    description: "3D Gaussian Splatting (3DGS) represents scenes as a set of 3D Gaussians rather than implicit neural functions, enabling real-time rendering at 100+ FPS. Training takes minutes rather than hours compared to NeRF. The method won the SIGGRAPH 2023 Best Paper Award and has rapidly become the standard for photorealistic 3D reconstruction in AR/VR pipelines.",
    links: [
      { label: "Read Paper", url: "https://arxiv.org/abs/2308.04079", primary: true },
      { label: "Project Page", url: "https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/", primary: false },
      { label: "GitHub", url: "https://github.com/graphdeco-inria/gaussian-splatting", primary: false },
    ],
    stars: 5.0,
    saves: 3241,
    featured: true,
  },
  {
    id: "r-016",
    title: "Lenis — Smooth Scroll Library",
    category: "tools",
    type: "repo",
    author: "Studio Freight",
    date: "2024-08-01",
    readTime: "30 min",
    difficulty: "Beginner",
    tags: ["Lenis", "Smooth Scroll", "JavaScript", "GSAP"],
    excerpt: "Lenis is a lightweight, performant smooth scroll library designed to work seamlessly with GSAP ScrollTrigger.",
    description: "Lenis is a smooth scroll library that provides buttery-smooth inertia scrolling with GSAP ticker integration. It replaces the browser's native scroll behavior with a physics-based easing model, keeps ScrollTrigger in perfect sync, and provides hooks for touch devices. Zero dependencies, ~3KB gzipped.",
    links: [
      { label: "GitHub", url: "https://github.com/darkroomengineering/lenis", primary: true },
      { label: "npm", url: "https://www.npmjs.com/package/lenis", primary: false },
    ],
    stars: 4.8,
    saves: 987,
    featured: false,
  },
  {
    id: "r-017",
    title: "Spatial Audio for WebXR — Web Audio API Guide",
    category: "webxr",
    type: "article",
    author: "Chrome Developers",
    date: "2024-05-20",
    readTime: "20 min read",
    difficulty: "Intermediate",
    tags: ["Web Audio API", "Spatial Audio", "HRTF", "WebXR"],
    excerpt: "How to implement immersive 3D spatial audio in WebXR experiences using the Web Audio API and PannerNode.",
    description: "Spatial audio dramatically enhances the sense of presence in XR experiences. This guide covers the Web Audio API's PannerNode for HRTF-based head-related transfer function audio, AudioListener positioning, Doppler effects, and room acoustics simulation. Includes complete code examples for a WebXR scene with positional audio sources.",
    links: [
      { label: "Read Article", url: "https://developer.chrome.com/blog/web-audio-spatial/", primary: true },
      { label: "Web Audio API MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API", primary: false },
    ],
    stars: 4.4,
    saves: 213,
    featured: false,
  },
  {
    id: "r-018",
    title: "Framer Motion — Production-Ready Animation for React",
    category: "tools",
    type: "docs",
    author: "Framer",
    date: "2024-10-01",
    readTime: "2 hours",
    difficulty: "Beginner",
    tags: ["Framer Motion", "React", "Animation", "Gestures"],
    excerpt: "Framer Motion is a production-ready motion library for React powering animations, gestures, layout transitions, and exit animations.",
    description: "Framer Motion provides a simple declarative API for complex animations in React. Features include spring animations, keyframes, layout animations (magic motion), drag gestures, scroll-triggered animations, exit animations with AnimatePresence, and shared layout transitions. Works seamlessly with Next.js and React 18.",
    links: [
      { label: "Documentation", url: "https://www.framer.com/motion/", primary: true },
      { label: "Examples", url: "https://www.framer.com/motion/examples/", primary: false },
    ],
    stars: 4.8,
    saves: 1432,
    featured: false,
  },
  {
    id: "r-019",
    title: "OpenXR — The Open Standard for XR Development",
    category: "tools",
    type: "docs",
    author: "Khronos Group",
    date: "2024-07-01",
    readTime: "4 hours",
    difficulty: "Advanced",
    tags: ["OpenXR", "Cross-platform", "VR", "AR", "C++"],
    excerpt: "OpenXR is the royalty-free, open standard for cross-platform XR development — write once, run on any headset.",
    description: "OpenXR is the Khronos Group's open standard API for accessing XR hardware and runtimes. It provides a unified interface across Meta Quest, HTC Vive, Valve Index, Microsoft HoloLens, Varjo, and other XR platforms. Available in C/C++, with bindings for Unity and Unreal Engine. Eliminates the fragmentation of platform-specific XR SDKs.",
    links: [
      { label: "Khronos OpenXR", url: "https://www.khronos.org/openxr/", primary: true },
      { label: "Specification", url: "https://registry.khronos.org/OpenXR/", primary: false },
    ],
    stars: 4.6,
    saves: 445,
    featured: false,
  },
  {
    id: "r-020",
    title: "ML Kit — Machine Learning for Mobile XR",
    category: "ai-xr",
    type: "tool",
    author: "Google",
    date: "2024-09-15",
    readTime: "3 hours",
    difficulty: "Intermediate",
    tags: ["ML Kit", "Machine Learning", "Mobile", "Object Detection"],
    excerpt: "Google's ML Kit brings powerful on-device machine learning to mobile apps — object detection, face mesh, pose detection for AR.",
    description: "ML Kit provides ready-to-use ML models optimized for mobile devices. For XR development, key capabilities include Face Mesh detection (468 landmarks), Object Detection & Tracking, Pose Detection (33 body landmarks), Selfie Segmentation, and Barcode Scanning. All models run on-device with no network requirement, enabling real-time AR overlays.",
    links: [
      { label: "ML Kit Docs", url: "https://developers.google.com/ml-kit", primary: true },
      { label: "Codelabs", url: "https://developers.google.com/codelabs/mlkit-android", primary: false },
    ],
    stars: 4.6,
    saves: 334,
    featured: false,
  },
];

// ── Mock API function — replace body with real fetch when backend is ready ──
export const fetchResources = async ({
  query = "",
  page = 1,
  perPage = 10,
  category = "all",
  type = "all",
} = {}) => {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 120));

  let results = [...RESOURCES_DATA];

  // Filter by category
  if (category !== "all") {
    results = results.filter((r) => r.category === category);
  }

  // Filter by type
  if (type !== "all") {
    results = results.filter((r) => r.type === type);
  }

  // Search — title + tags + author + excerpt
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.excerpt.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = results.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = results.slice(start, start + perPage);

  return { data, total, totalPages, page, perPage };
};