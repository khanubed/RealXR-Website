import { heroData } from "../data/heroData";
import { aboutData } from "../data/aboutData";
import { domainsData } from "../data/domainsData";
import { projectsData, PROJECTS } from "../data/projectData";
import { eventsData, EVENTS } from "../data/eventsData";
import { teams } from "../data/teamsData";
import { RESOURCES_DATA } from "../data/resourceData";
import { sendJoinApplication } from "../services/emailService";

// -----------------------------------------------
// API client (backend-first, local data fallback)
// -----------------------------------------------

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Fetch a content section from the RealXR Content API.
 * Falls back to the bundled local data whenever the API is
 * unreachable, slow, or returns an error — the site always renders.
 */
export const fetchSection = async (section, fallback) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_URL}/api/content/${section}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return fallback;
    const payload = await response.json();
    return payload?.data ?? fallback;
  } catch {
    return fallback;
  }
};

// Unwrap server payloads that wrap lists in a named key,
// keeping the shape the website components expect.
const asList = (data, key, fallback) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return fallback;
};

// -----------------------------------------------
// Home page sections
// -----------------------------------------------

// Hero Section
export const getHeroData = async () => {
  const data = await fetchSection("hero", heroData);
  return { heroData: data };
};

// About Section
export const getAboutData = async () => {
  const data = await fetchSection("about", aboutData);
  return { aboutData: data };
};

export const getDomainsData = async () => {
  const data = await fetchSection("domains", domainsData);
  return { domainsData: data };
};

export const getProjectsData = async () => {
  const data = await fetchSection("projects", projectsData);
  return { projectsData: data };
};

export const getEventsData = async () => {
  const data = await fetchSection("events", eventsData);
  return { eventsData: data };
};

// -----------------------------------------------
// Other sections
// -----------------------------------------------

// Team — list of member groups
export const getTeamsData = async () => {
  const data = await fetchSection("teams", teams);
  return asList(data, "groups", teams);
};

// Gallery — list of gallery events (each with media items)
export const getGalleryEvents = async () => {
  const data = await fetchSection("gallery", EVENTS);
  return asList(data, "events", EVENTS);
};

// Projects page — list of projects
export const getProjectsPageData = async () => {
  const data = await fetchSection("projectsPage", PROJECTS);
  return asList(data, "projects", PROJECTS);
};

// Resources — list of resources
export const getResourcesData = async () => {
  const data = await fetchSection("resources", RESOURCES_DATA);
  return asList(data, "resources", RESOURCES_DATA);
};

// -----------------------------------------------
// Join form submission (EmailJS)
// -----------------------------------------------

export const postJoinForm = async (payload) => {
  return sendJoinApplication(payload);
};
