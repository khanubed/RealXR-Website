# RealXR Sanity Studio

1. Create a Sanity project at https://sanity.io/manage.
2. In this directory run `npm install`, then set `SANITY_STUDIO_PROJECT_ID` (and optionally `SANITY_STUDIO_DATASET`) in `.env`.
3. Run `npm run dev` to open the content admin panel. Upload images/videos through the **Media** field, or retain an existing external asset using **External image/video URL**.
4. Create documents for Hero, About, Domains, Projects, Events, Team Groups/Members, Gallery Events, Resources, and Blog Posts. The homepage reads the Hero, About, Domain, Project, and Event records now; the remaining schemas are ready for their matching page content and preserve every current content shape (media, headings, descriptions, tags and links). The Join form settings control its editable copy and options; submissions appear in **Join applications**.
5. Add matching public values to the website root `.env` using `.env.example`, and add the server-only `SANITY_*` values to Vercel for join submissions.

Do not put `SANITY_API_WRITE_TOKEN` or any write token in a `VITE_` variable. The included `../api/join.js` is the only component that writes applications.
