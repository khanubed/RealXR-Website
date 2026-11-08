import React from "react";
import Hero from "../../sections/Hero/Hero";
import HeroVideo from "../../sections/Hero/HeroVideo";
import About from "../../sections/About/About";
import Domains from "../../sections/Domains/Domains";
import Projects from "../../sections/Projects/Projects";
import TeamIntro from "../../sections/Team/TeamIntro";
import Team from "../../sections/Team/Team";
import Join from "../../sections/Join/Join";
import RedSection from "../../sections/Footer/RedSection";
import EventsShowcase from "../../sections/Events/EventsShowcase.jsx";
import usePageMeta from "../../hooks/usePageMeta";

// Master client datasets (Code-first JAMstack architecture)
import { heroData } from "../../data/heroData";
import { aboutData } from "../../data/aboutData";
import { domainsData } from "../../data/domainsData";
import { projectsData } from "../../data/projectData";
import { eventsData } from "../../data/eventsData";
import { teams } from "../../data/teamsData";

const Home = () => {
  usePageMeta({
    title: "Home",
    description: "Official portfolio of RealXR — the AR/VR and Spatial Computing laboratory at Institute of Engineering & Science, IPS Academy, Indore.",
    canonical: "https://realxr.in/",
  });

  return (
    <>
      <Hero content={heroData} />
      <HeroVideo content={heroData} />
      <About content={aboutData} />
      <Domains content={domainsData} />
      <Projects content={projectsData} />
      <EventsShowcase content={eventsData} />
      <TeamIntro content={teams} />
      <Team content={teams} />
      
      {/* Pinned Join Section footprint */}
      <div style={{ position: "relative", height: "250vh" }}>
        <Join />
      </div>

      {/* Renders right above global layout footer */}
      <RedSection />
    </>
  );
};

export default Home;
