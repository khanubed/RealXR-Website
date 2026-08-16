// Minimal Google Analytics 4 loader (gtag.js).
// Active only when VITE_GA_MEASUREMENT_ID is set in the environment —
// otherwise every call is a no-op and no script is loaded.

export const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

export const isAnalyticsEnabled = () => Boolean(GA_ID);

const gtag = (...args) => {
  if (!isAnalyticsEnabled()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
  // window.gtag may be set later once the script loads; the dataLayer
  // push above is exactly what the real gtag() forwards to.
};

/**
 * Loads the gtag.js script and initializes the measurement ID.
 * Safe to call multiple times.
 */
export const initAnalytics = () => {
  if (!isAnalyticsEnabled()) return;
  if (window.__realxr_ga_loaded) return;
  window.__realxr_ga_loaded = true;

  gtag("js", new Date());
  gtag("config", GA_ID, {
    send_page_view: false, // SPA sends its own page views below
    transport_type: "beacon",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.onload = () => {
    if (window.gtag) window.gtag("config", GA_ID, { send_page_view: false });
  };
  document.head.appendChild(script);
};

/**
 * Track an SPA route change as a GA4 page view.
 */
export const trackPageView = (path, title) => {
  if (!isAnalyticsEnabled()) return;
  gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Track a custom GA4 event (e.g. form submissions).
 */
export const trackEvent = (name, params = {}) => {
  if (!isAnalyticsEnabled()) return;
  gtag("event", name, params);
};