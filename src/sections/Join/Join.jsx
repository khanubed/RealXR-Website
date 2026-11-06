import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sendJoinApplication } from "../../services/emailService";
import { trackEvent } from "../../lib/analytics.js";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_INTEREST_OPTIONS = [
  "Web Development",
  "AR / VR Development",
  "Game Development",
  "Graphic Design",
  "Social Media & Content",
  "Event Management",
];

const inputStyle = {
  width: "100%",
  padding: "0.6rem 1.3rem",
  borderRadius: "10px",
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  fontFamily: "Syne, sans-serif",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const labelStyle = {
  display: "block",
  fontFamily: "Syne, sans-serif",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#00F5D4",
  marginBottom: "0.25rem",
};

const Join = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    branch: "",
    email: "",
    phone: "",
    interests: [],
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [error, setError] = useState("");

  const interestOptions = DEFAULT_INTEREST_OPTIONS;

  // Context-safe animation hook
  useGSAP(
    () => {
      if (status === "done") return;

      gsap.set([headingRef.current, subRef.current], { opacity: 0, y: 20 });
      if (formRef.current) {
        gsap.set(formRef.current, { opacity: 0, y: 24 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.35");

      if (formRef.current) {
        tl.to(formRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.3");
      }
    },
    { scope: sectionRef, dependencies: [status] }
  );

  const toggleInterest = (option) => {
    setForm((prev) => {
      const has = prev.interests.includes(option);
      return {
        ...prev,
        interests: has
          ? prev.interests.filter((i) => i !== option)
          : [...prev.interests, option],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      name: "",
      branch: "",
      email: "",
      phone: "",
      interests: [],
      message: "",
    });
    setError("");
    setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.branch.trim() || !form.email.trim()) {
      setError("Please fill in your name, branch & year, and email address.");
      return;
    }

    if (status === "submitting") return;

    setStatus("submitting");
    try {
      await sendJoinApplication({
        name: form.name.trim(),
        branch: form.branch.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        interests: form.interests,
        message: form.message.trim(),
      });

      trackEvent("join_form_submit", {
        interests: form.interests.join(", "),
      });

      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the form. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "4rem clamp(1.2rem, 4vw, 1.6rem)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            ref={headingRef}
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.8vw, 2.6rem)",
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: "0 0 0.5rem 0",
              lineHeight: 1.2,
            }}
          >
            "Ready to Build Something Real?"
          </h2>
          <p
            ref={subRef}
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            "No experience required. No prerequisites. Just show up with curiosity and the willingness to learn — we'll handle the rest."
          </p>
        </div>

        {status === "done" ? (
          <div
            style={{
              textAlign: "center",
              padding: "2.5rem 1.5rem",
              background: "rgba(22, 22, 22, 0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0, 245, 212, 0.25)",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0, 245, 212, 0.08)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(0, 245, 212, 0.15)",
                border: "1.5px solid #00F5D4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem auto",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00F5D4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "1.6rem",
                color: "#ffffff",
                margin: "0 0 0.5rem 0",
              }}
            >
              Application Received!
            </h3>
            <p
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.7)",
                maxWidth: 440,
                margin: "0 auto 1.5rem auto",
                lineHeight: 1.6,
              }}
            >
              Thank you for applying to RealXR. Our core team has received your submission and will get in touch regarding onboarding and upcoming hackathons.
            </p>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "0.6rem 1.6rem",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00F5D4";
                e.currentTarget.style.color = "#0a0a0a";
                e.currentTarget.style.borderColor = "#00F5D4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            {/* Row: Name / Branch */}
            <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  style={inputStyle}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Branch & Year*</label>
                <input
                  type="text"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  style={inputStyle}
                  placeholder="e.g. CSE, 2nd Year"
                  required
                />
              </div>
            </div>

            {/* Row: Email / Phone */}
            <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  style={inputStyle}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  style={inputStyle}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Interests */}
            <div>
              <label style={{ ...labelStyle, marginBottom: "0.6rem" }}>
                I'm interested in:
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  rowGap: "0.4rem",
                  columnGap: "1rem",
                }}
              >
                {interestOptions.map((option) => {
                  const checked = form.interests.includes(option);
                  return (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        cursor: status === "submitting" ? "not-allowed" : "pointer",
                        userSelect: "none",
                        fontFamily: "Syne, sans-serif",
                        fontSize: "0.88rem",
                        color: checked ? "#00F5D4" : "rgba(255,255,255,0.85)",
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: `1.5px solid ${checked ? "#00F5D4" : "rgba(255,255,255,0.4)"}`,
                          background: checked ? "#00F5D4" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "background 0.15s, border-color 0.15s",
                        }}
                      >
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <path
                              d="M1 5l2.5 2.5L9 2"
                              stroke="#0a0a0a"
                              strokeWidth="1.6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={status === "submitting"}
                        onChange={() => toggleInterest(option)}
                        style={{ display: "none" }}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>What can we help you with?</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                disabled={status === "submitting"}
                placeholder="Enter message here"
                rows={2}
                style={{
                  ...inputStyle,
                  borderRadius: "14px",
                  resize: "vertical",
                  minHeight: 60,
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "#ff6b6b",
                  fontFamily: "Syne, sans-serif",
                  fontSize: "0.85rem",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                marginTop: "0.4rem",
                padding: "0.85rem 2rem",
                borderRadius: "999px",
                background: status === "submitting" ? "rgba(0, 245, 212, 0.15)" : "transparent",
                border: status === "submitting" ? "1.5px solid #00F5D4" : "1.5px solid #fff",
                color: status === "submitting" ? "#00F5D4" : "#fff",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: status === "submitting" ? "wait" : "pointer",
                opacity: status === "submitting" ? 0.85 : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (status === "submitting") return;
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                if (status === "submitting") return;
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {status === "submitting" ? (
                <>
                  <svg
                    style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting Application…</span>
                </>
              ) : (
                "Apply to Join RealXR"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Join;
