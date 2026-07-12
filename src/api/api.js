import api from "./axios";
import { heroData } from "../data/heroData";
import { domainsData } from "../data/domainsData";
import { projectsData } from "../data/projectData";
import { eventsData } from "../data/eventsData";

// -----------------------------------------------
// API Endpoints
// -----------------------------------------------

// Hero Section
export const getHeroData = async () => {
  try {
    const response = await api.get("/api/hero");
    return response.data;
  } catch (error) {
    // If API fails, return fallback data
    console.warn("⚠️ API failed, returning fallback hero data", error);
    return {
      heroData: heroData,
    };
  }
};

// About Section
export const getAboutData = async () => {
  try {
    const response = await api.get("/api/about");
    return response.data;
  } catch (error) {
    console.warn("⚠️ API failed, returning fallback about data", error);
    return {
      
    };
  }
};

export const getDomainsData = async () => {
    try {
        const response = await api.get("/api/domains")
        return response.data;
    } catch (error) {
        console.warn("⚠️ API failed, returning fallback domains data", error);
        return {
            domainsData: domainsData,
        }
    }
}

export const getProjectsData = async () => {
    try {
        const response = await api.get("/api/projects")
        return response.data;
    } catch (error) {
        console.warn("⚠️ API failed, returning fallback projects data", error);
        return {
            projectsData: projectsData,
        }
    }
}

export const getEventsData = async () => {
    try {
        const response = await api.get("/api/events")
        return response.data;
    } catch (error) {
        console.warn("⚠️ API failed, returning fallback events data", error);
        return {
            eventsData: eventsData,
        }
    }
}



// Add more functions for other sections as needed:
// export const getDomainsData = async () => { ... };
// export const getProjectsData = async () => { ... };

