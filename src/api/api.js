import { heroData } from "../data/heroData";
import { aboutData } from "../data/aboutData";
import { domainsData } from "../data/domainsData";
import { projectsData } from "../data/projectData";
import { eventsData } from "../data/eventsData";
import { fetchSanity } from "../sanity/client";

// -----------------------------------------------
// API Endpoints
// -----------------------------------------------

// Hero Section
export const getHeroData = async () => {
  const content = await fetchSanity(`*[_type == "hero"][0]{title, tagline, scrollText, marqueeText, "heroImageUrl": coalesce(heroMedia.image.asset->url, heroMedia.externalUrl), "videoUrl": coalesce(backgroundVideo.video.asset->url, backgroundVideo.externalUrl), "imageAltText": heroMedia.alt}`);
  console.log(content)
  return { heroData: content || heroData };
  
};

// About Section
export const getAboutData = async () => {
  const content = await fetchSanity(`*[_type == "about"][0]{heading, textBlocks[]{text, isHighlight}}`);
  return { aboutData: content || aboutData };
};

export const getDomainsData = async () => {
    const content = await fetchSanity(`*[_type == "domain"] | order(order asc){"id": slug.current, "num": number, label, title, description, "bgColor": backgroundColor, textColor, tagColor}`);
    return { domainsData: content?.length ? { ...domainsData, slides: content } : domainsData };
}

export const getProjectsData = async () => {
    const content = await fetchSanity(`*[_type == "project"] | order(year desc){"id": slug.current, title, tag: category, "img": coalesce(cover.image.asset->url, cover.externalUrl)}`);
    return { projectsData: content?.length ? { ...projectsData, projects: content } : projectsData };
}

export const getEventsData = async () => {
    const content = await fetchSanity(`*[_type == "event"] | order(order asc, date desc){"id": slug.current, title, "date": dateLabel, "desc": description, tags, accent, coverGradient, "images": media[].externalUrl}`);
    return { eventsData: content?.length ? { ...eventsData, events: content } : eventsData };
}

