import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartSimple,
  faClock,
  faHandshake,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import {
  CTAActions,
  CTAButton,
  CTAContent,
  CTAFeature,
  CTAFeatureIcon,
  CTAFeatures,
  CTAIcon,
  CTAIntro,
  CTASectionWrapper,
  CTAShell,
  CTASubtitle,
  CTATitle,
} from "./CTASection.styles";

const ctaFeatures = [
  { label: "Trusted Experts", icon: faShieldHalved },
  { label: "Timely Support", icon: faClock },
  { label: "Growth Focused", icon: faChartSimple },
];

function CTASection() {
  return (
    <CTASectionWrapper aria-labelledby="home-cta-title">
      <CTAShell>
        <CTAIntro>
          <CTAIcon aria-hidden="true">
            <FontAwesomeIcon icon={faHandshake} />
          </CTAIcon>
          <CTAContent>
            <CTATitle id="home-cta-title">
              Let&apos;s work together to drive <strong>clarity and growth.</strong>
            </CTATitle>
            <CTASubtitle>
              Our experts are ready to understand your needs and deliver the right
              financial solutions.
            </CTASubtitle>
          </CTAContent>
        </CTAIntro>

        <CTAFeatures aria-label="Service strengths">
          {ctaFeatures.map((item) => (
            <CTAFeature key={item.label}>
              <CTAFeatureIcon aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} />
              </CTAFeatureIcon>
              <span>{item.label}</span>
            </CTAFeature>
          ))}
        </CTAFeatures>

        <CTAActions>
          <CTAButton to="/contact" $variant="primary">
            Book a Consultation
            <FontAwesomeIcon icon={faArrowRight} />
          </CTAButton>
          <CTAButton to="/services" $variant="secondary">
            Explore Services
            <FontAwesomeIcon icon={faArrowRight} />
          </CTAButton>
        </CTAActions>
      </CTAShell>
    </CTASectionWrapper>
  );
}

export default CTASection;
