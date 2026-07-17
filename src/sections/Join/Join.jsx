import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INTEREST_OPTIONS = [
  "Web Development",
  "AR / VR Development",
  "Game Development",
  "Graphic Design",
  "Social Media & Content",
  "Event Management",
];

const inputStyle = {
  width: "100%",
  padding: "0.5rem 1.3rem",
  borderRadius: "10px",
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  fontFamily: "Syne, sans-serif",
  fontSize: "0.95rem",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontFamily: "Syne, sans-serif",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#00F5D4",
  marginBottom: "0.2rem",
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

  // Context-safe animation hook
  useGSAP(
    () => {
      // Gated check: If form is submitted successfully, skip animating form elements
      if (status === "done") return;

      // Set initial hidden states safely within scope
      gsap.set([headingRef.current, subRef.current], { opacity: 0, y: 20 });
      if (formRef.current) {
        gsap.set(formRef.current, { opacity: 0, y: 24 });
      }

      // Simple once-only content reveal
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.branch.trim() || !form.email.trim()) {
      setError("Please fill in your name, branch & year, and email.");
      return;
    }

    setStatus("submitting");
    try {
      await new Promise((res) => setTimeout(res, 700));
      setStatus("done");
    } catch (err) {
      setError("Something went wrong — please try again.");
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
        height: "100vh",
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
            Ready to Build Something Real?
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
            No experience required. No prerequisites. Just show up with
            curiosity and the willingness to learn — we'll handle the rest.
          </p>
        </div>

        {status === "done" ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 0",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#00F5D4",
            }}
          >
            Thanks for applying! We'll be in touch soon.
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
                  style={inputStyle}
                  placeholder="Your full name"
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Branch & Year*</label>
                <input
                  type="text"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. CSE, 2nd Year"
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
                  style={inputStyle}
                  placeholder="you@example.com"
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Phone</label>
                <input
                  type="teal"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
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
                {INTEREST_OPTIONS.map((option) => {
                  const checked = form.interests.includes(option);
                  return (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        cursor: "pointer",
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
                marginTop: "0.2rem",
                padding: "0.8rem 2rem",
                borderRadius: "999px",
                background: "transparent",
                border: "1.5px solid #fff",
                color: "#fff",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                opacity: status === "submitting" ? 0.6 : 1,
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (status === "submitting") return;
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {status === "submitting" ? "Submitting..." : "Apply to Join RealXR"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Join;