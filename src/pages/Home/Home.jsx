
import React, { useEffect, useState } from "react";
import Hero from "../../sections/Hero/Hero";
import HeroVideo from "../../sections/Hero/HeroVideo";
import About from "../../sections/About/About";
import Domains from "../../sections/Domains/Domains";
import Projects from "../../sections/Projects/Projects";
import TeamIntro from "../../sections/Team/TeamIntro";
import Team from "../../sections/Team/Team";
import Join from "../../sections/Join/Join";
import RedSection from "../../sections/Footer/RedSection";
import { getHeroData, getAboutData, getDomainsData, getProjectsData, getEventsData, getTeamsData } from "../../api/api";
import EventsShowcase from "../../sections/Events/EventsShowcase.jsx";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchAllData = async () => {
      try {
        const [hero, about, domains, projects, events, teamsData] = await Promise.all([
          getHeroData(),
          getAboutData(),
          getDomainsData(),
          getProjectsData(),
          getEventsData(),
          getTeamsData(),
        ]);
        
        if (active) {
          setHomeData({
            hero: hero?.heroData,
            about: about?.aboutData,
            domains: domains?.domainsData,
            projects: projects?.projectsData,
            events: events?.eventsData || events || [],
            teams: teamsData || [],
          });
          
          // Let React render the DOM updates first, then refresh ScrollTrigger
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 300);
        }
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
      }
    };

    fetchAllData();
    return () => {
      active = false;
    };
  }, []);

  const heroContent = homeData?.hero || undefined;
  const aboutContent = homeData?.about || undefined;
  const domainsContent = homeData?.domains || undefined;
  const projectsContent = homeData?.projects || undefined;
  const eventsContent = homeData?.events || undefined;
  const teamsContent = homeData?.teams || undefined;

  return (
    <>
      <Hero content={heroContent} />
      <HeroVideo content={heroContent} />
      <About content={aboutContent} />
      <Domains content={domainsContent} />
      <Projects content={projectsContent} />
      <EventsShowcase content={eventsContent} />
      <TeamIntro content={teamsContent} />
      <Team content={teamsContent} />
      
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