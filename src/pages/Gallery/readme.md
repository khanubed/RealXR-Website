# RealXR Gallery Module

## Files
```
gallery/
├── GalleryDashboard.jsx  ← Main page controller
├── MediaGrid.jsx         ← Responsive Pinterest-style waterfall masonry grid with GSAP stagger
├── MediaCard.jsx         ← Lightweight Pinterest tile (natural aspect ratio, hover video preview, clean overlay)
├── Lightbox.jsx          ← Fullscreen modal viewer
└── README.md
```

## Content Management

Gallery data is managed directly in code in [`src/data/galleryData.js`](file:///d:/CODING/Collage/RealXR-Portfolio/RealX-Website/src/data/galleryData.js). To add or update event albums and media items, edit the `EVENTS` array in that file.

### Deep-link URLs
```
/gallery                                 → Event dashboard
/gallery?event=hackathon-3               → Event grid
/gallery?event=hackathon-3&media=h3-02  → Lightbox open
```

## Performance Notes

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
