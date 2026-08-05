import technologies from "../../data/technologies";

import {
  Dots,
  LogoImage,
  LogoName,
  LogoTrack,
  LogoViewport,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  TechnologyLogo,
  TechnologiesSection,
} from "./TechnologiesWeUseSection.styles";

const marqueeItems = [...technologies, ...technologies];

function TechnologiesWeUseSection() {
  return (
    <TechnologiesSection aria-labelledby="technologies-title">
      <SectionHeader>
        <SectionTitle id="technologies-title">
          <strong>Technologies</strong> we use
        </SectionTitle>
        <SectionIntro>
          We work with trusted accounting, compliance and analytics platforms to
          keep workflows accurate, organized and efficient.
        </SectionIntro>
        <Dots aria-hidden="true">
          <span />
          <span />
          <span />
        </Dots>
      </SectionHeader>

      <LogoViewport aria-label="Technologies and tools">
        <LogoTrack>
          {marqueeItems.map((technology, index) => (
            <TechnologyLogo key={`${technology.name}-${index}`}>
              <LogoImage
                src={technology.logo}
                alt={`${technology.name} logo`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <LogoName>{technology.name}</LogoName>
            </TechnologyLogo>
          ))}
        </LogoTrack>
      </LogoViewport>
    </TechnologiesSection>
  );
}

export default TechnologiesWeUseSection;
