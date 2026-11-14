/**
 * emailService.js
 * ─────────────────────────────────────────────────────────────────
 * RealXR — EmailJS Integration Service
 * Dispatches student join applications directly to club leadership
 * without needing an external backend or database server.
 * ─────────────────────────────────────────────────────────────────
 */

import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

/**
 * Checks if EmailJS is configured with active credentials.
 */
export const isEmailConfigured = () => {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
};

/**
 * Sends a student application to the club inbox via EmailJS.
 *
 * @param {Object} formData
 * @param {string} formData.name - Applicant full name
 * @param {string} formData.branch - Department & Year
 * @param {string} formData.email - Email address
 * @param {string} [formData.phone] - Contact number
 * @param {string[]} [formData.interests] - Selected disciplines
 * @param {string} [formData.message] - Note or motivation
 * @returns {Promise<{ success: boolean, simulated?: boolean, message: string }>}
 */
export const sendJoinApplication = async (formData) => {
  const { name, branch, email, phone, interests = [], message } = formData;

  if (!name?.trim() || !branch?.trim() || !email?.trim()) {
    throw new Error("Please provide your name, branch & year, and email address.");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error("Please enter a valid email address.");
  }

  // Graceful fallback for local development if credentials aren't set yet
  if (!isEmailConfigured()) {
    console.warn(
      "[EmailJS] Credentials not configured in .env (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY). Simulating successful submission in dev mode."
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      simulated: true,
      message: "Application submitted (dev mode — configure EmailJS keys in .env for production email delivery).",
    };
  }

  const templateParams = {
    user_name: name.trim(),
    branch_year: branch.trim(),
    user_email: email.trim(),
    reply_to: email.trim(),
    phone_number: phone?.trim() || "Not provided",
    interests: interests.length > 0 ? interests.join(", ") : "General Exploration",
    message: message?.trim() || "No specific message provided.",
    submitted_at: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }),
  };

  // 10-second timeout race
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error("The email server took too long to respond. Please check your connection and try again.")
        ),
      10000
    )
  );

  const sendPromise = emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    { publicKey: PUBLIC_KEY }
  );

  try {
    await Promise.race([sendPromise, timeoutPromise]);
    return {
      success: true,
      message: "Application successfully submitted!",
    };
  } catch (err) {
    const errorMsg =
      err?.text || err?.message || "Could not send application. Please try again or reach out to us directly.";
    throw new Error(errorMsg);
  }
};

