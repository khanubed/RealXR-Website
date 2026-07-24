import { memo, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./gallery-lightbox.css";

const GalleryLightbox = memo(function GalleryLightbox({ items, accent = "#00BFAE" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("media");
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const open = activeIndex >= 0;

  const slides = useMemo(() => items.map((item) => (
    item.type === "video"
      ? {
          type: "video", poster: item.thumb, alt: item.caption,
          width: item.width, height: item.height, controls: true, playsInline: true,
          sources: [{ src: item.videoMp4, type: "video/mp4" }],
        }
      : { src: item.src, alt: item.caption, title: item.caption, width: item.width, height: item.height }
  )), [items]);

  const updateMedia = useCallback((mediaId) => {
    const next = new URLSearchParams(searchParams);
    if (mediaId) next.set("media", mediaId);
    else next.delete("media");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <Lightbox
      open={open}
      close={() => updateMedia(null)}
      index={Math.max(activeIndex, 0)}
      slides={slides}
      plugins={[Zoom, Video, Thumbnails, Counter]}
      on={{ view: ({ index }) => updateMedia(items[index]?.id) }}
      zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
      thumbnails={{ position: "bottom", width: 84, height: 56, border: 2, borderRadius: 10, padding: 6, gap: 8 }}
      carousel={{ finite: true, padding: "4%", imageFit: "contain" }}
      controller={{ closeOnBackdropClick: true }}
      video={{ controls: true, playsInline: true }}
      styles={{
        container: { backgroundColor: "rgba(10, 12, 19, 0.96)", "--yarl__color_button": accent },
        slide: { padding: "clamp(1rem, 4vw, 4rem)" },
      }}
      labels={{ Close: "Close gallery", "Zoom in": "Zoom in", "Zoom out": "Zoom out" }}
    />
  );
});

export default GalleryLightbox;
