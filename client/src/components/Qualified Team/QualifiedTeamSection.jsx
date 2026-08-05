import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faBuildingColumns,
  faCalculator,
  faChartLine,
  faClock,
  faEllipsis,
  faGlobe,
  faMagnifyingGlass,
  faShieldHalved,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import {
  CredentialCard,
  CredentialGrid,
  CredentialIcon,
  Dots,
  FeatureCard,
  FeatureDivider,
  FeatureIcon,
  FeatureItem,
  FeatureText,
  ImageFrame,
  QualifiedContent,
  QualifiedSection,
  SectionCopy,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  TeamImage,
} from "./QualifiedTeamSection.styles";

const credentials = [
  { label: "FCA", icon: faAward },
  { label: "CMA", icon: faChartLine },
  { label: "DISA", icon: faShieldHalved },
  { label: "CPA", icon: faGlobe },
  { label: "EA", icon: faCalculator },
  { label: "CFE", icon: faMagnifyingGlass },
  { label: "CIA", icon: faShieldHalved },
  { label: "CS", icon: faBuildingColumns },
  { label: "& More", icon: faEllipsis },
];

const features = [
  { label: "Experienced Professionals", icon: faUsers },
  { label: "Diverse Expertise", icon: faClock },
  { label: "Quality Assurance", icon: faShieldHalved },
  { label: "Client Focused", icon: faChartLine },
];

function QualifiedTeamSection() {
  return (
    <QualifiedSection aria-labelledby="qualified-team-title">
      <SectionHeader>
        <SectionTitle id="qualified-team-title">
          <strong>Qualified</strong> team
        </SectionTitle>
        <SectionIntro>
          A passionate team of associates and partners experienced in finance,
          accounting, audit, assurance, payroll, tax and systems.
        </SectionIntro>
        <Dots aria-hidden="true">
          <span />
          <span />
          <span />
        </Dots>
      </SectionHeader>

      <QualifiedContent>
        <SectionCopy>
          <p>
            Our professionals bring practical experience across audit, fraud investigation,
            taxation, compliance and advisory, with qualifications including <strong>FCA,
            CMA, DISA, CPA, EA, CFE, CIA, CS</strong> and more.
          </p>

          <CredentialGrid>
            {credentials.map((item) => (
              <CredentialCard key={item.label}>
                <CredentialIcon>
                  <FontAwesomeIcon icon={item.icon} />
                </CredentialIcon>
                <span>{item.label}</span>
              </CredentialCard>
            ))}
          </CredentialGrid>
        </SectionCopy>

        <ImageFrame>
          <TeamImage
            src="/images/qualified-team.png"
            alt="Qualified ARP Associates team"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <FeatureCard>
            {features.map((feature, index) => (
              <FeatureItem key={feature.label}>
                <FeatureIcon>
                  <FontAwesomeIcon icon={feature.icon} />
                </FeatureIcon>
                <FeatureText>{feature.label}</FeatureText>
                {index < features.length - 1 && <FeatureDivider aria-hidden="true" />}
              </FeatureItem>
            ))}
          </FeatureCard>
        </ImageFrame>
      </QualifiedContent>
    </QualifiedSection>
  );
}

export default QualifiedTeamSection;
