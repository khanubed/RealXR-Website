import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScrollToTop = ({ lenisRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenisRef.current) {
      // Instantly reset smooth scroller position to top
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Force GSAP to recalculate positions for elements on the new page
    ScrollTrigger.refresh();
  }, [pathname, lenisRef]);

  return null;
};

export default ScrollToTop;