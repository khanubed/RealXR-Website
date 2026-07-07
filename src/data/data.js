// data.js
export const domainsData = [
  {
    id: "ar-dev",
    num: "01",
    label: "SERVICES",
    title: "AR\nDevelopment",
    description: "We build augmented reality apps that overlay digital intelligence onto the physical world. From marker-based filters to real-time object detection — using ARKit, ARCore, and Spark AR.",
    bgColor: "#EF444466",    // Crimson/Red at exactly 40% opacity
    textColor: "#000000",  
    tagColor: "#333333",   
  },
  {
    id: "vr-dev",
    num: "02",
    label: "SERVICES",
    title: "VR\nDevelopment",
    description: "We craft fully immersive virtual environments for education, therapy, gaming, and simulation. Built with Unity XR and Unreal Engine, designed to make you forget the real world exists.",
    bgColor: "#818CF866",    // Emerald/Green at exactly 40% opacity
    textColor: "#000000",  
    tagColor: "#333333",   
  },
  {
    id: "game-dev",
    num: "03",
    label: "SERVICES",
    title: "Game\nDevelopment",
    description: "We build games across both Unity and Unreal Engine — from indie 2D experiments to full 3D immersive experiences. Gameplay, physics, shaders, storytelling — all of it.",
    bgColor: "#38BDF866",    // Sky Blue at exactly 40% opacity
    textColor: "#000000",  
    tagColor: "#333333",   
  },
  {
    id: "modelling-3d",
    num: "04",
    label: "SERVICES",
    title: "3D\nModelling",
    description: "Every great XR experience starts with great assets. We model, rig, texture, and animate 3D objects using Blender and Maya — the backbone of everything we build.",
    bgColor: "#111113",      // Kept dark, deep, and fully solid
    textColor: "#22D3EE",  
    tagColor: "#22D3EE",   
  }
];

export const projectsData = [
  { id: 1, title: "Grand Theft Auto - V", tag: "Game", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Cyberpunk 2047", tag: "Game", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Resident Evil Village", tag: "Game", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Red Dead Redemption", tag: "Game", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "City Driving", tag: "Game", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Id Mafia 4", tag: "Game", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Mumbai Gullies", tag: "Game", img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "PUBG Mobile", tag: "Game", img: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80" },
];

export const rainImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60" },
  { id: 2, url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60" },
  { id: 3, url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&auto=format&fit=crop&q=60" },
  { id: 4, url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=500&auto=format&fit=crop&q=60" },
  { id: 5, url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60" },
  { id: 6, url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60" },
  { id: 7, url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60" },
  { id: 8, url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=60" },
  { id: 9, url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=60" },
  { id: 10, url: "https://images.unsplash.com/photo-1531535934202-f0d44431dfec?w=500&auto=format&fit=crop&q=60" },
  { id: 11, url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&auto=format&fit=crop&q=60" },
  { id: 12, url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&auto=format&fit=crop&q=60" },
];

export const eventsData = [
  {
    id: 1,
    title: "RealXR Hackathon 2.0",
    date: "March 2024 · Main Auditorium",
    desc: "18 teams. 24 hours. Zero sleep. Our second hackathon saw students build everything from AR campus navigation to a VR mental health app. The energy was electric.",
    tags: ["72 Participants", "₹30K Prizes", "24 Hours"],
    accent: "#a78bfa",
    // Placeholder gradient thumbs — swap with real image paths
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80",
      "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?w=400&q=80",
    ],
    coverGradient:
      "linear-gradient(135deg, #2d1b69 0%, #1a0533 50%, #0f0020 100%)",
  },
  {
    id: 2,
    title: "Blender Bootcamp",
    date: "January 2024 · Computer Lab 3",
    desc: "3 days. 6 hours each. 40 students went from zero to their first game-ready 3D asset. Every participant shipped a final model.",
    tags: ["40 Students", "3 Days", "Beginner Friendly"],
    accent: "#34d399",
    images: [
      "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      "https://images.unsplash.com/photo-1616509091215-57b834e55a56?w=400&q=80",
    ],
    coverGradient:
      "linear-gradient(135deg, #0d2b1d 0%, #0a1f15 50%, #050f0a 100%)",
  },
  {
    id: 3,
    title: "AR at Scale — Guest Talk",
    date: "November 2023 · Seminar Hall",
    desc: "150+ attendees packed the hall for a senior engineer breaking down production AR systems. 45 min talk, 30 min open Q&A. Recording on YouTube.",
    tags: ["150+ Attendees", "Industry Speaker", "Recorded"],
    accent: "#f59e0b",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&q=80",
    ],
    coverGradient:
      "linear-gradient(135deg, #2b1a00 0%, #1a1000 50%, #0f0900 100%)",
  },
  {
    id: 4,
    title: "48HR Game Jam",
    date: "September 2023 · Club Lab",
    desc: "10 teams. 48 hours. Theme: Spatial Chaos. Games built in Unity and Unreal — all playable on our itch.io page. Winner: GravityFlip, a VR puzzle platformer.",
    tags: ["10 Teams", "Unity + Unreal", "48 Hours"],
    accent: "#f472b6",
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    ],
    coverGradient:
      "linear-gradient(135deg, #2b0a1a 0%, #1a0510 50%, #0f0208 100%)",
  },
];

// data.js

export const teamImages = [
  {
    id: 1,
    name: "Aria Chen",
    role: "Founding Lead & XR Architect",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Graphics Engineer & Shader Wizard",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Spatial UX/UI Designer",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Devon Lane",
    role: "Unity/Unreal Gameplay Developer",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Kiara Advani",
    role: "AR Prototyper & Hardware Specialist",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Liam Foster",
    role: "3D Technical Artist",
    url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Sarah Jenkins",
    role: "XR Interaction Researcher",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Zayn Malik",
    role: "Core Systems & Deployment Lead",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
  }
];
