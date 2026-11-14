import { useEffect } from "react";

/**
 * Custom hook to dynamically manage document head metadata (Title, Description, OpenGraph, Canonical)
 * for Single Page Applications without heavy external dependencies.
 *
 * @param {Object} meta
 * @param {string} meta.title - Route title (e.g., "Projects & Prototypes")
 * @param {string} [meta.description] - Route-specific meta description
 * @param {string} [meta.canonical] - Absolute canonical URL (e.g., "https://realxr.in/projects")
 * @param {string} [meta.image] - OpenGraph / Twitter preview card image URL
 */
export function usePageMeta({ title, description, canonical, image = "https://realxr.in/image.webp" } = {}) {
  useEffect(() => {
    const brandSuffix = "RealXR — Spatial Computing Lab";
    const fullTitle = title ? `${title} · ${brandSuffix}` : brandSuffix;

    // Update document title
    document.title = fullTitle;

    // Safe helper to create or update meta tags
    const setMeta = (selector, attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Update standard description
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }

    // Update OG & Twitter titles
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);

    // Update Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
      setMeta('meta[property="og:url"]', "property", "og:url", canonical);
      setMeta('meta[name="twitter:url"]', "name", "twitter:url", canonical);
    }

    // Update OpenGraph & Twitter preview images
    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }
  }, [title, description, canonical, image]);
}

export default usePageMeta;

