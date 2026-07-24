import { defineArrayMember, defineField, defineType } from "sanity";

const url = (name, title, validation) =>
  defineField({ name, title, type: "url", validation });
const title = () =>
  defineField({
    name: "title",
    title: "Title",
    type: "string",
    validation: (Rule) => Rule.required(),
  });
const slug = () =>
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source: "title", maxLength: 96 },
    validation: (Rule) => Rule.required(),
  });

const media = defineType({
  name: "media",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      initialValue: "image",
      options: { list: ["image", "video"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Uploaded image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind === "video",
    }),
    defineField({
      name: "video",
      title: "Uploaded video",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.kind !== "video",
    }),
    url("externalUrl", "External image/video URL", (Rule) =>
      Rule.uri({ scheme: ["http", "https"] }),
    ),
    defineField({ name: "alt", title: "Alt text / caption", type: "string" }),
  ],
  preview: { select: { title: "alt", media: "image" } },
});

const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    url("url", "URL", (Rule) => Rule.required().uri({ allowRelative: true })),
  ],
});

const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    title(),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "marqueeText", type: "string" }),
    defineField({ name: "scrollText", type: "string" }),
    defineField({ name: "heroMedia", title: "Hero image", type: "media" }),
    defineField({
      name: "backgroundVideo",
      title: "Background video",
      type: "media",
    }),
  ],
});

const about = defineType({
  name: "about",
  title: "About section",
  type: "document",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "textBlocks",
      title: "Styled text",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "text",
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "isHighlight",
              title: "Highlight",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
    }),
  ],
});

const domain = defineType({
  name: "domain",
  title: "Domain",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({ name: "number", type: "string" }),
    defineField({ name: "label", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "backgroundColor", type: "string" }),
    defineField({ name: "textColor", type: "string" }),
    defineField({ name: "tagColor", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "category", type: "string" }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["live", "prototype", "rnd", "archived"] },
    }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "featured", type: "boolean" }),
    defineField({ name: "platform", type: "string" }),
    defineField({ name: "cover", type: "media" }),
    defineField({
      name: "stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "team",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
  ],
});

const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({
      name: "dateLabel",
      title: "Date / location",
      type: "string",
    }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "accent", type: "string" }),
    defineField({ name: "coverGradient", type: "string" }),
    defineField({
      name: "media",
      type: "array",
      of: [defineArrayMember({ type: "media" })],
    }),
    defineField({ name: "order", type: "number" }),
  ],
});

const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "photo", type: "media" }),
    url("instagram", "Instagram"),
    url("linkedin", "LinkedIn"),
    url("github", "GitHub"),
    defineField({
      name: "group",
      type: "reference",
      to: [{ type: "teamGroup" }],
    }),
    defineField({ name: "order", type: "number" }),
  ],
});
const teamGroup = defineType({
  name: "teamGroup",
  title: "Team group",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({ name: "label", type: "string" }),
    defineField({ name: "accent", type: "string" }),
    defineField({ name: "background", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

const galleryEvent = defineType({
  name: "galleryEvent",
  title: "Gallery event",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "date", type: "date" }),
    defineField({
      name: "media",
      type: "array",
      of: [defineArrayMember({ type: "media" })],
    }),
  ],
});
const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "resourceType", type: "string" }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "cover", type: "media" }),
    url("resourceUrl", "Resource URL", (Rule) => Rule.required()),
  ],
});
const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  fields: [
    title(),
    slug(),
    defineField({ name: "excerpt", type: "text" }),
    defineField({
      name: "content",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "authorName", type: "string" }),
    defineField({ name: "authorRole", type: "string" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "readTime", type: "string" }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "cover", type: "media" }),
    defineField({ name: "featured", type: "boolean" }),
  ],
});
const joinFormSettings = defineType({
  name: "joinFormSettings",
  title: "Join form settings",
  type: "document",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text" }),
    defineField({
      name: "interests",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "submitLabel", type: "string" }),
    defineField({ name: "successMessage", type: "string" }),
  ],
});
const joinApplication = defineType({
  name: "joinApplication",
  title: "Join applications",
  type: "document",
  readOnly: ({ currentUser }) =>
    !currentUser?.roles?.some((role) => role.name === "administrator"),
  fields: [
    defineField({ name: "name", type: "string", readOnly: true }),
    defineField({ name: "branch", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "phone", type: "string", readOnly: true }),
    defineField({
      name: "interests",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({ name: "submittedAt", type: "datetime", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      initialValue: "new",
      options: { list: ["new", "contacted", "accepted", "declined"] },
    }),
    defineField({ name: "adminNotes", type: "text" }),
  ],
  preview: { select: { title: "name", subtitle: "email" } },
});

export const schemaTypes = [
  media,
  link,
  hero,
  about,
  domain,
  project,
  event,
  teamGroup,
  teamMember,
  galleryEvent,
  resource,
  blogPost,
  joinFormSettings,
  joinApplication,
];
