import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;

export const sanityEnabled = Boolean(projectId && import.meta.env.VITE_SANITY_DATASET);

export const sanityClient = sanityEnabled
  ? createClient({
      projectId: "n528t8e9",
      dataset: "production",
      apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01",
      useCdn: true,
      perspective: "published",
    })
  : null;

export async function fetchSanity(query, params = {}) {
  console.log(projectId)
  console.log(import.meta.env.VITE_SANITY_PROJECT_ID)
  console.log(sanityClient)
  console.log(import.meta.env.VITE_SANITY_API_VERSION)
  console.log(query)
  console.log('something fucked')
  if (!sanityClient) return null;
  console.log('something fucked not')
  return sanityClient.fetch(query, params);
}
