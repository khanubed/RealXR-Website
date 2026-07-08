# RealXR Gallery Module

## Files
```
gallery/
├── GalleryData.js        ← Mock data (swap exports for API calls)
├── GalleryDashboard.jsx  ← Main page controller
├── MediaGrid.jsx         ← Bento grid with GSAP stagger
├── MediaCard.jsx         ← Individual tile (image + video)
├── Lightbox.jsx          ← Fullscreen modal viewer
└── README.md
```

## Setup

### 1. Install dependencies
```bash
npm i gsap react-router-dom
```

### 2. Add route in your router
```jsx
// App.jsx or your router file
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GalleryDashboard from "./gallery/GalleryDashboard";

<BrowserRouter>
  <Routes>
    <Route path="/gallery" element={<GalleryDashboard />} />
  </Routes>
</BrowserRouter>
```

### 3. Deep-link URLs
```
/gallery                                 → Event dashboard
/gallery?event=hackathon-3               → Event grid
/gallery?event=hackathon-3&media=h3-02  → Lightbox open
```

## Replacing mock data with a real API

In `GalleryData.js`, replace the `EVENTS` export with an async fetch:

```js
// Before (mock)
export const EVENTS = [ ... ];

// After (real API)
export const fetchEvents = async () => {
  const res = await fetch("/api/gallery/events");
  return res.json();
};
```

Then in `GalleryDashboard.jsx`, use `useEffect` + `useState`:
```jsx
const [events, setEvents] = useState([]);
useEffect(() => { fetchEvents().then(setEvents); }, []);
```

Zero other changes needed — the UI layer is fully decoupled from the data layer.

## Performance notes

| Technique | Where | Why |
|---|---|---|
| Aspect-ratio padding trick | `MediaCard` | Prevents CLS before images load |
| IntersectionObserver | `MediaCard` | Lazy-loads src only when near viewport |
| Video `preload="none"` | `MediaCard` | Prevents all videos buffering on page load |
| Video IO pause | `MediaCard` | Frees memory when card scrolls out |
| `useMemo` on media filter | `GalleryDashboard` | Prevents recompute on every render |
| `memo()` on all card components | All cards | Prevents re-render when cursor moves |
| `gsap.killTweensOf()` before stagger | `MediaGrid` | Prevents animation pile-up on fast tab switching |
| `clearProps: "transform"` | `MediaGrid` | Releases GPU layer after entry animation |