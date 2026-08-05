import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { services } from "../../data/services";
import {
  CardArrow,
  CardContent,
  CardDivider,
  CardIcon,
  CardText,
  CardTitle,
  Dots,
  SectionDecor,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  ServicesCard,
  ServicesGrid,
  ServicesSection,
} from "./OurServicesSection.styles";

function OurServicesSection() {
  return (
    <ServicesSection aria-labelledby="our-services-title">
      <SectionDecor aria-hidden="true" />
      <SectionHeader>
        <SectionTitle id="our-services-title">
          <strong>What</strong> we do
        </SectionTitle>
        <SectionIntro>
          We deliver tailored solutions in assurance, advisory, taxation and technology
          to help businesses grow with confidence.
        </SectionIntro>
        <Dots aria-hidden="true">
          <span />
          <span />
          <span />
        </Dots>
      </SectionHeader>

      <ServicesGrid>
        {services.map((service) => (
          <ServicesCard
            key={service.title}
            to={`/services/${service.slug}`}
            aria-label={`View ${service.title} service details`}
          >
            <CardIcon aria-hidden="true">
              <FontAwesomeIcon icon={service.icon} />
            </CardIcon>
            <CardDivider aria-hidden="true" />
            <CardContent>
              <CardTitle>{service.title}</CardTitle>
              <CardText>{service.summary}</CardText>
            </CardContent>
            <CardArrow aria-hidden="true">
              <FontAwesomeIcon icon={faArrowRight} />
            </CardArrow>
          </ServicesCard>
        ))}
      </ServicesGrid>
    </ServicesSection>
  );
}

export default OurServicesSection;
