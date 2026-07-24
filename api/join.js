import { createClient } from "@sanity/client";

const required = ["name", "branch", "email"];
const text = (value, max = 1000) => String(value || "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = req.body || {};
  if (required.some((field) => !text(body[field]))) {
    return res.status(400).json({ message: "Name, branch and email are required." });
  }

  if (!/^\S+@\S+\.\S+$/.test(text(body.email, 254))) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_WRITE_TOKEN) {
    return res.status(503).json({ message: "Applications are not configured yet." });
  }

  try {
    const client = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      apiVersion: "2025-01-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });
    await client.create({
      _type: "joinApplication",
      name: text(body.name, 120),
      branch: text(body.branch, 160),
      email: text(body.email, 254).toLowerCase(),
      phone: text(body.phone, 40),
      interests: Array.isArray(body.interests) ? body.interests.map((item) => text(item, 80)).filter(Boolean).slice(0, 12) : [],
      message: text(body.message, 2000),
      submittedAt: new Date().toISOString(),
      status: "new",
    });
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Unable to save join application", error);
    return res.status(500).json({ message: "Could not submit your application." });
  }
}
