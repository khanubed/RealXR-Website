import React from "react";
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";

// Layout & Views
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home/Home";
import GalleryDashboard from "./pages/Gallery/GalleryDashboard";
import Resources from "./pages/Resource/Resource";
import Projects from "./pages/Project/Projects";

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
    element: <RootLayout />,
    errorElement: <ErrorPage />, // <-- Added here to catch anything in the children
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "gallery",
        element: <GalleryDashboard />,
      },
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;