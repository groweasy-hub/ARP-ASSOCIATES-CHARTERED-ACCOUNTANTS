import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faBullseye,
  faChartLine,
  faGlobe,
  faLocationDot,
  faPeopleGroup,
  faShieldHalved,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

import {
  AboutHero,
  AboutPage,
  DottedDecor,
  FeatureCard,
  FeatureGrid,
  FeatureIcon,
  HeroContent,
  HeroCopy,
  HeroDescription,
  HeroTitle,
  OfficeCard,
  OfficeGrid,
  OfficeIcon,
  OfficesSection,
  SectionEyebrow,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  StatCard,
  StatsBand,
  TextColumn,
  WhoGrid,
  WhyCard,
  WhyGrid,
} from "./About.styles";

const features = [
  {
    title: "Client First",
    text: "We listen, understand and prioritize your business needs.",
    icon: faUserGroup,
  },
  {
    title: "Expertise You Trust",
    text: "Our team brings deep knowledge and diverse industry experience.",
    icon: faPeopleGroup,
  },
  {
    title: "Integrity Always",
    text: "We uphold the highest standards of ethics and transparency.",
    icon: faShieldHalved,
  },
  {
    title: "Results That Matter",
    text: "We deliver measurable outcomes that contribute to your success.",
    icon: faChartLine,
  },
];

const stats = [
  { value: "500+", label: "Clients", icon: faUserGroup },
  { value: "30+", label: "Years of Experience", icon: faBriefcase },
  { value: "10+", label: "Expert Professionals", icon: faPeopleGroup },
  { value: "2+", label: "Countries", icon: faGlobe },
];

const reasons = [
  {
    title: "Tailored Solutions",
    text: "Customized strategies designed to meet your unique business needs.",
    icon: faBullseye,
  },
  {
    title: "Comprehensive Services",
    text: "End-to-end support across assurance, taxation, advisory and more.",
    icon: faShieldHalved,
  },
  {
    title: "Global Perspective",
    text: "Serving domestic and international clients with global standards.",
    icon: faChartLine,
  },
];

const offices = [
  {
    title: "Head Office - Kolkata",
    lines: [
      "133/1A, Pushka bhavan,",
      "SN Banerjee Road, 4th Floor,",
      "Kolkata - 700013.",
    ],
  },
  {
    title: "Hyderabad Office",
    lines: [
      "1-11-122, Shyamlal Buildings",
      "Begumpet",
      "Hyderabad, Telangana 500016.",
    ],
  },
];

function About() {
  return (
    <AboutPage aria-labelledby="about-title">
      <AboutHero>
        <DottedDecor $position="left" aria-hidden="true" />
        <DottedDecor $position="right" aria-hidden="true" />

        <HeroContent>
          <HeroTitle id="about-title">
            Progressive &amp; <br />
            Multifaceted firm
          </HeroTitle>
          <HeroCopy>Domestic &amp; international clients</HeroCopy>
          <HeroDescription>
            At ARP Associates, we blend deep industry expertise with a
            client-first approach to deliver solutions that create value, ensure
            compliance, and drive sustainable growth.
          </HeroDescription>
        </HeroContent>
      </AboutHero>

      <WhoGrid>
        <TextColumn>
          <SectionEyebrow>Who we are</SectionEyebrow>
          <SectionTitle>
            Your growth is our <strong>commitment.</strong>
          </SectionTitle>
          <SectionIntro>
            Founded with a vision to provide high-quality, reliable and timely
            financial solutions, ARP Associates has grown into a trusted partner
            for businesses across industries.
          </SectionIntro>
          <SectionIntro>
            Our team of experienced professionals works closely with clients to
            understand their goals and deliver tailored solutions with integrity
            and excellence.
          </SectionIntro>
        </TextColumn>

        <FeatureGrid>
          {features.map((item) => (
            <FeatureCard key={item.title}>
              <FeatureIcon aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} />
              </FeatureIcon>
              <div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </WhoGrid>

      <StatsBand aria-label="ARP Associates statistics">
        {stats.map((item) => (
          <StatCard key={item.label}>
            <FeatureIcon aria-hidden="true">
              <FontAwesomeIcon icon={item.icon} />
            </FeatureIcon>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </StatCard>
        ))}
      </StatsBand>

      <SectionHeader>
        <SectionEyebrow>Why choose us</SectionEyebrow>
        <SectionTitle>More than just numbers.</SectionTitle>
        <SectionIntro>
          We go beyond traditional accounting to become your strategic partner
          in growth and success.
        </SectionIntro>
      </SectionHeader>

      <WhyGrid>
        {reasons.map((item) => (
          <WhyCard key={item.title}>
            <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </WhyCard>
        ))}
      </WhyGrid>

      <OfficesSection>
        <SectionEyebrow>Our offices</SectionEyebrow>
        <SectionIntro>
          Two branches, one commitment to your success.
        </SectionIntro>
        <OfficeGrid>
          {offices.map((office) => (
            <OfficeCard key={office.title}>
              <OfficeIcon aria-hidden="true">
                <FontAwesomeIcon icon={faLocationDot} />
              </OfficeIcon>
              <div>
                <h2>{office.title}</h2>
                {office.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </OfficeCard>
          ))}
        </OfficeGrid>
      </OfficesSection>
    </AboutPage>
  );
}

export default About;
