import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faClock,
  faShieldHalved,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import {
  HeroActions,
  HeroButton,
  HeroCopy,
  HeroDescription,
  HeroImage,
  HeroInner,
  HeroKicker,
  HeroKickerDot,
  HeroSection,
  HeroTitle,
  HeroVisual,
  HeroVisualGlow,
  HeroVisualStack,
  TrustIcon,
  TrustItem,
  TrustStrip,
  TrustText,
} from "./HomeHeroSection.styles";

const heroImages = [
  {
    src: "/images/intro-img-people 3.svg",
    alt: "Financial document audit illustration",
    size: {
      width: "80%",
      height: "80%",
    },
  },
  {
    src: "/images/intro-img-people 2.svg",
    alt: "Financial reporting review illustration",
    size: {
      width: "80%",
      height: "80%",
    },
  },
  {
    src: "/images/intro-img-people 1.svg",
    alt: "Business advisory discussion illustration",
    size: {
      width: "80%",
      height: "80%",
    },
  },
];

const trustItems = [
  {
    title: "Reliable",
    subtitle: "Compliance",
    icon: faShieldHalved,
  },
  {
    title: "Experienced",
    subtitle: "Professionals",
    icon: faUsers,
  },
  {
    title: "Timely",
    subtitle: "Delivery",
    icon: faClock,
  },
  {
    title: "Growth",
    subtitle: "Focused",
    icon: faChartLine,
  },
];

function HomeHeroSection() {
  return (
    <HeroSection aria-labelledby="home-hero-title">
      <HeroInner>
        <HeroCopy>
          <HeroKicker>
            <HeroKickerDot aria-hidden="true" />
            Trusted Financial Partner
          </HeroKicker>

          <HeroTitle id="home-hero-title">
            Structured
            <span>Financial Clarity</span>
            for Growth
          </HeroTitle>

          <HeroDescription>
            We help businesses stay audit-ready, compliant, and financially
            organized with reliable accounting, taxation, payroll, and advisory
            support.
          </HeroDescription>
        </HeroCopy>

        <HeroVisual aria-label="Financial clarity visuals">
          <HeroVisualGlow aria-hidden="true" />
          <HeroVisualStack>
            {heroImages.map((image, index) => (
              <HeroImage
                key={image.src}
                src={image.src}
                alt={image.alt}
                $index={index}
                $size={image.size}
              />
            ))}
          </HeroVisualStack>
        </HeroVisual>

        <HeroActions>
          <HeroButton $variant="primary" href="/contact">
            Free Consultation
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </HeroButton>
          <HeroButton $variant="secondary" href="/services">
            Explore Services
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </HeroButton>
        </HeroActions>

        <TrustStrip aria-label="Service strengths">
          {trustItems.map((item) => (
            <TrustItem key={`${item.title}-${item.subtitle}`}>
              <TrustIcon aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} />
              </TrustIcon>
              <TrustText>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </TrustText>
            </TrustItem>
          ))}
        </TrustStrip>
      </HeroInner>
    </HeroSection>
  );
}

export default HomeHeroSection;
