import React from "react";
import Hero from "../../sections/Hero/Hero";
import HeroVideo from "../../sections/Hero/HeroVideo";
import About from "../../sections/About/About";
import Domains from "../../sections/Domains/Domains";
import Projects from "../../sections/Projects/Projects";
import Moments from "../../sections/Events/Moments";
import PastEvents from "../../sections/Events/PastEvents";
import TeamIntro from "../../sections/Team/TeamIntro";
import Team from "../../sections/Team/Team";
import Join from "../../sections/Join/Join";

const Home = () => {
  return (
    <>
      <Hero />
      <HeroVideo />
      <About />
      <Domains />
      <Projects />
      <Moments />
      <PastEvents />
      <TeamIntro />
      <Team />
      
      {/* Pinned Join Section footprint */}
      <div style={{ position: "relative", height: "250vh" }}>
        <Join />
      </div>
    </>
  );
};

export default Home;