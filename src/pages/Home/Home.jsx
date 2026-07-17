import React, { useEffect, useState } from "react";
import Hero from "../../sections/Hero/Hero";
import HeroVideo from "../../sections/Hero/HeroVideo";
import About from "../../sections/About/About";
import Domains from "../../sections/Domains/Domains";
import Projects from "../../sections/Projects/Projects";
import TeamIntro from "../../sections/Team/TeamIntro";
import Team from "../../sections/Team/Team";
import Join from "../../sections/Join/Join";
import RedSection from "../../sections/Footer/RedSection"; // <-- Import here
import { getHeroData, getAboutData , getDomainsData , getProjectsData , getEventsData} from "../../api/api";
import EventsShowcase from "../../sections/Events/EventsShowcase.jsx";

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [domainsData, setDomainsData] = useState(null);
  const [projectData , setProjectsData] = useState(null);
  const [eventsData , setEventsData] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const data = await getHeroData();
      setHeroData(data.heroData);
    };
    const fetchAboutData = async () => {
      const data = await getAboutData();
      setAboutData(data.aboutData);
    };
    const fetchDomainsData = async() =>{
      const data = await getDomainsData();
      setDomainsData(data.domainsData);
    };
    const fetchProjectsData = async() =>{
      const data = await getProjectsData();
      setProjectsData(data.projectsData);
    };
    const fetchEventsData = async()=>{
      const data = await getEventsData();
      setEventsData(data?.eventsData || data || []);
    };

    fetchHeroData();
    fetchAboutData();
    fetchDomainsData();
    fetchProjectsData();
    fetchEventsData();
  }, []);

  return (
    <>
      <Hero content={heroData || undefined} />
      <HeroVideo content={heroData || undefined} />
      <About content={aboutData || undefined} />
      <Domains content={domainsData || undefined} />
      <Projects content={projectData || undefined}/>
      <EventsShowcase content={eventsData || undefined}/>
      <TeamIntro />
      <Team />
      
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