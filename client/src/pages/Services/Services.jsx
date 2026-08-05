import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import {
  faArrowRight,
  faAward,
  faChartLine,
  faClock,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import { services } from "../../data/services";
import {
  BenefitCard,
  BenefitsBand,
  Hero,
  HeroContent,
  HeroDescription,
  HeroTitle,
  DottedDecor,
  ServiceCard,
  ServiceGrid,
  ServiceIcon,
  ServicesPage,
  SectionHeader,
  SectionIntro,
  SectionTitle,
} from "./Services.styles";

const benefits = [
  {
    title: "Experienced Professionals",
    text: "Skilled experts delivering quality solutions",
    icon: faPeopleGroup,
  },
  {
    title: "Timely Delivery",
    text: "On-time, every time you can count on us",
    icon: faClock,
  },
  {
    title: "Quality Assurance",
    text: "Highest standards of accuracy & compliance",
    icon: faAward,
  },
  {
    title: "Client Focused",
    text: "Your success is our ultimate priority",
    icon: faChartLine,
  },
];

function Services() {
  return (
    <ServicesPage aria-labelledby="services-title">
      <Hero>
        <DottedDecor $position="left" aria-hidden="true" />
        <DottedDecor $position="right" aria-hidden="true" />
        <HeroContent>
          <HeroTitle id="services-title">
            Solutions that drive <strong>clarity, compliance &amp; growth</strong>
          </HeroTitle>
          <HeroDescription>
            We deliver tailored solutions in assurance, advisory, taxation and
            technology to help businesses grow with confidence.
          </HeroDescription>
        </HeroContent>
      </Hero>

      <SectionHeader>
        <SectionTitle>What we do</SectionTitle>
        <SectionIntro>
          Explore our wide range of professional services designed to meet your
          business needs at every stage of growth.
        </SectionIntro>
      </SectionHeader>

      <ServiceGrid>
        {services.map((service) => (
          <ServiceCard key={service.title}>
            <ServiceIcon aria-hidden="true">
              <FontAwesomeIcon icon={service.icon} />
            </ServiceIcon>
            <h2>{service.title}</h2>
            <p>{service.summary}</p>
            <NavLink to={`/services/${service.slug}`}>
              Learn more
              <FontAwesomeIcon icon={faArrowRight} />
            </NavLink>
          </ServiceCard>
        ))}
      </ServiceGrid>

      <BenefitsBand aria-label="Service benefits">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.title}>
            <ServiceIcon aria-hidden="true">
              <FontAwesomeIcon icon={benefit.icon} />
            </ServiceIcon>
            <div>
              <h2>{benefit.title}</h2>
              <p>{benefit.text}</p>
            </div>
          </BenefitCard>
        ))}
      </BenefitsBand>
    </ServicesPage>
  );
}

export default Services;
