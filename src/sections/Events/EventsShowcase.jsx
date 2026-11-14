import React, { useMemo } from "react";
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

// ── Main Events Showcase Component ─────────────────────────────────
const EventsShowcase = ({ content = defaultContent }) => {
  // Filter by featured !== false so unfeatured events only appear in /gallery
  const events = useMemo(
    () => normalizeEvents(content).filter((event) => event?.featured !== false),
    [content]
  );

  // Extract up to 3 images from each featured event for the 3D rain animation
  const allImages = useMemo(() => {
    if (!events.length) return [];
    return events.flatMap((event) => (event?.images || []).slice(0, 3));
  }, [events]);

  if (!events.length) return null;

  return (
    <div>
      <Moments
        images={allImages}
        title={content?.title || "MOMENTS"}
        subTitle={content?.subTitle}
      />
      <PastEvents events={events} />
    </div>
  );
};

export default EventsShowcase;
