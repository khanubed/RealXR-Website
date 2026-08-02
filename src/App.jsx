import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

// Layout & Views
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home/Home";

// Lazily loaded on navigation (non-home routes)
const GalleryDashboard = lazy(() => import("./pages/Gallery/GalleryDashboard"));
const Resources = lazy(() => import("./pages/Resource/Resource"));
const Projects = lazy(() => import("./pages/Project/Projects"));

// Simple fallback while a lazy route loads
const RouteFallback = () => (
  <div
    className="fixed inset-0 flex flex-col items-center justify-center gap-4"
    style={{ background: "#06070A" }}
  >
    {/* Spinning tracking ring — echoes the preloader's reticle motif */}
    <div
      className="relative w-12 h-12"
      style={{ animation: "route-fallback-spin 1.1s linear infinite" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px solid rgba(255,255,255,0.08)",
          borderTopColor: "#FFB13C",
        }}
      />
    </div>

    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/30">
      Loading
    </span>

    <style>{`
      @keyframes route-fallback-spin {
        to { transform: rotate(360deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        [style*="animation"] { animation: none !important; }
      }
    `}</style>
  </div>
);

// A simple fallback component to catch the crash
const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div style={{ padding: "2rem", color: "red" }}>
      <h2>Oops! The app crashed.</h2>
      <p>{error?.message || "An unexpected error occurred."}</p>
    </div>
  );
};

// Define modern data routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // <-- Added here to catch anything in the children
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "gallery",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <GalleryDashboard />
          </Suspense>
        ),
      },
      {
        path: "resources",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <Resources />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <Projects />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
