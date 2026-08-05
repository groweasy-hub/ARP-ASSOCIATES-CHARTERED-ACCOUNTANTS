import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faCircleNodes,
  faFileLines,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";

import { getServiceBySlug, serviceReferenceLinks } from "../../data/services";
import {
  BackLink,
  CapabilityGrid,
  ContentGrid,
  CTAButton,
  DottedDecor,
  Hero,
  HeroContent,
  HeroDescription,
  HeroTitle,
  InfoCard,
  IntroPanel,
  List,
  NotFoundPanel,
  ProcessGrid,
  ProcessStep,
  ReferenceGrid,
  ServiceDetailPage,
  SectionEyebrow,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  SplitGrid,
} from "./ServiceDetail.styles";

function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getServiceBySlug(slug);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/services");
  };

  if (!service) {
    return (
      <ServiceDetailPage>
        <NotFoundPanel>
          <SectionTitle>Service not found</SectionTitle>
          <SectionIntro>
            The service you are looking for may have moved. Browse all services
            and choose the one that best matches your requirement.
          </SectionIntro>
          <CTAButton to="/services">
            View Services
            <FontAwesomeIcon icon={faArrowRight} />
          </CTAButton>
        </NotFoundPanel>
      </ServiceDetailPage>
    );
  }

  return (
    <ServiceDetailPage aria-labelledby="service-detail-title">
      <Hero>
        <DottedDecor $position="left" aria-hidden="true" />
        <DottedDecor $position="right" aria-hidden="true" />
        <BackLink type="button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </BackLink>
        <HeroContent>
          <HeroTitle id="service-detail-title">{service.title}</HeroTitle>
          <HeroDescription>{service.hero}</HeroDescription>
        </HeroContent>
      </Hero>

      <IntroPanel>
        <FontAwesomeIcon icon={service.icon} aria-hidden="true" />
        <div>
          <SectionEyebrow>Service overview</SectionEyebrow>
          <p>{service.overview}</p>
        </div>
      </IntroPanel>

      <SplitGrid>
        <InfoCard>
          <FontAwesomeIcon icon={faCircleNodes} aria-hidden="true" />
          <h2>Who this is for</h2>
          <List>
            {service.idealFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
        </InfoCard>

        <InfoCard>
          <FontAwesomeIcon icon={faListCheck} aria-hidden="true" />
          <h2>Expected outcomes</h2>
          <List>
            {service.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
        </InfoCard>
      </SplitGrid>

      <SectionHeader>
        <SectionEyebrow>What we cover</SectionEyebrow>
        <SectionTitle>Practical support across the full engagement.</SectionTitle>
        <SectionIntro>
          Each engagement is scoped around your business context, compliance
          needs, documentation maturity and decision timelines.
        </SectionIntro>
      </SectionHeader>

      <CapabilityGrid>
        {service.capabilities.map((item) => (
          <InfoCard key={item}>
            <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
            <p>{item}</p>
          </InfoCard>
        ))}
      </CapabilityGrid>

      <SectionHeader>
        <SectionEyebrow>Our approach</SectionEyebrow>
        <SectionTitle>A clear process from discovery to delivery.</SectionTitle>
      </SectionHeader>

      <ProcessGrid>
        {service.process.map((item, index) => (
          <ProcessStep key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </ProcessStep>
        ))}
      </ProcessGrid>

      <ContentGrid>
        <InfoCard>
          <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
          <h2>Typical deliverables</h2>
          <List>
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
        </InfoCard>

        <InfoCard>
          <SectionEyebrow>Reference basis</SectionEyebrow>
          <p>
            The page content is informed by public professional guidance on
            audit assurance, recordkeeping, cybersecurity risk management,
            finance transformation and valuation advisory.
          </p>
          <ReferenceGrid>
            {serviceReferenceLinks.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </a>
            ))}
          </ReferenceGrid>
        </InfoCard>
      </ContentGrid>

    </ServiceDetailPage>
  );
}

export default ServiceDetail;
