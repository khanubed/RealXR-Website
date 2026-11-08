/**
 * api.js (Static Client Architecture)
 * ─────────────────────────────────────────────────────────────────
 * RealXR operates entirely on a static, zero-latency client JAMstack model.
 * Content is bundled statically via `src/data/` modules for instant 60 FPS loading.
 *
 * This module is maintained for backward compatibility.
 * ─────────────────────────────────────────────────────────────────
 */

import { heroData } from "../data/heroData";
import { aboutData } from "../data/aboutData";
import { domainsData } from "../data/domainsData";
import { projectsData, PROJECTS } from "../data/projectData";
import { eventsData, EVENTS } from "../data/eventsData";
import { teams } from "../data/teamsData";
import { RESOURCES_DATA } from "../data/resourceData";
import { sendJoinApplication } from "../services/emailService";

// Synchronous static data getters (zero network latency)
export const getHeroData = async () => ({ heroData });
export const getAboutData = async () => ({ aboutData });
export const getDomainsData = async () => ({ domainsData });
export const getProjectsData = async () => ({ projectsData });
export const getEventsData = async () => ({ eventsData });
export const getTeamsData = async () => teams;
export const getGalleryEvents = async () => EVENTS;
export const getProjectsPageData = async () => PROJECTS;
export const getResourcesData = async () => RESOURCES_DATA;

// Join form submission (direct to EmailJS)
export const postJoinForm = async (payload) => {
  return sendJoinApplication(payload);
};
