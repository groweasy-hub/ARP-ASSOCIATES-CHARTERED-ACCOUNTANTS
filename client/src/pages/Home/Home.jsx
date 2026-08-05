import CTASection from "../../components/CTA/CTASection.jsx";
import HomeHeroSection from "../../components/Home Hero/HomeHeroSection.jsx";
import OurServicesSection from "../../components/Our Services/OurServicesSection.jsx";
import QualifiedTeamSection from "../../components/Qualified Team/QualifiedTeamSection.jsx";
import TechnologiesWeUseSection from "../../components/Technologies We Use/TechnologiesWeUseSection.jsx";
import WhoWeServeSection from "../../components/Who we serve/WhoWeServeSection.jsx";

function Home() {
  return (
    <>
      <HomeHeroSection />
      <WhoWeServeSection />
      <OurServicesSection />
      <TechnologiesWeUseSection />
      <QualifiedTeamSection />
      <CTASection />
    </>
  );
}

export default Home;
