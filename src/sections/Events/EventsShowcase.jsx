 import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Moments from "./Moments";
import PastEvents from "./PastEvents";
import { eventsData } from "../../data/eventsData";

const defaultContent = eventsData;

const normalizeEvents = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.eventsData)) return value.eventsData;
  if (Array.isArray(value?.events)) return value.events;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

// ── 5. Main Parent Wrapper (Export This) ───────────────────────────
const EventsShowcase = ({ content = defaultContent }) => {
  const events = useMemo(() => normalizeEvents(content), [content]);

  // Extract all images from all events, flatten the array, and limit to 15 to preserve performance.
  const allImages = useMemo(() => {
    if (!events.length) return [];
    const extracted = events.flatMap((event) => event?.images || []);
    return extracted.slice(0, 15); // Performance cap
  }, [events]);

  if (!events.length) return null;

  return (
    <div className="">
      <Moments images={allImages} title={content.title} subTitle={content.subTitle} />
      <PastEvents events={events} />
    </div>
  );
};

export default EventsShowcase;