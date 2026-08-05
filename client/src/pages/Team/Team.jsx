import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

import {
  locationIcon,
  officeTeams,
  partners,
  teamStats,
} from "../../data/details";
import {
  Avatar,
  DottedDecor,
  HeroContent,
  HeroDescription,
  HeroSubtitle,
  HeroTitle,
  LinkedInLink,
  MemberItem,
  PartnerAvatar,
  PartnerAvatarImage,
  PartnerCard,
  PartnerGrid,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  StatCard,
  StatsPanel,
  TeamCard,
  TeamCardHeader,
  TeamGrid,
  TeamHero,
  TeamPage,
} from "./Team.styles";

function Team() {
  return (
    <TeamPage aria-labelledby="team-title">
      <TeamHero>
        <DottedDecor $position="left" aria-hidden="true" />
        <DottedDecor $position="right" aria-hidden="true" />
        <HeroContent>
          <HeroTitle id="team-title">Qualified &amp; </HeroTitle>
          <HeroSubtitle>Experienced team</HeroSubtitle>
          <HeroDescription>
            Our strength lies in our people. A team of qualified professionals
            working together with integrity and commitment to deliver
            excellence.
          </HeroDescription>
        </HeroContent>
      </TeamHero>

      <SectionHeader>
        <SectionTitle>Our Partners</SectionTitle>
        <SectionIntro>
          Led by experienced professionals with deep expertise and a commitment
          to excellence.
        </SectionIntro>
      </SectionHeader>

      <PartnerGrid>
        {partners.map((partner) => (
          <PartnerCard key={partner.name}>
            <PartnerAvatar>
              {partner.image ? (
                <PartnerAvatarImage src={partner.image} alt={partner.name} />
              ) : (
                partner.initials
              )}
            </PartnerAvatar>
            <div>
              <h2>{partner.name}</h2>
              <strong>{partner.role}</strong>
              <p>{partner.text}</p>
            </div>
            <LinkedInLink
              href={partner.linkedIn}
              aria-label={`${partner.name} LinkedIn`}
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </LinkedInLink>
          </PartnerCard>
        ))}
      </PartnerGrid>

      <SectionHeader>
        <SectionTitle>Our Teams</SectionTitle>
        <SectionIntro>
          Our teams in Hyderabad and Kolkata work seamlessly to deliver the best
          outcomes for our clients.
        </SectionIntro>
      </SectionHeader>

      <TeamGrid>
        {officeTeams.map((team) => (
          <TeamCard key={team.name}>
            <TeamCardHeader>
              <span aria-hidden="true">
                <FontAwesomeIcon icon={team.icon} />
              </span>
              <div>
                <h2>{team.name}</h2>
                <p>
                  <FontAwesomeIcon icon={locationIcon} />
                  {team.address}
                </p>
              </div>
            </TeamCardHeader>

            {team.members.map((member) => (
              <MemberItem key={`${team.name}-${member.name}`}>
                <Avatar>{member.initials}</Avatar>
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <LinkedInLink
                  href={member.linkedIn}
                  aria-label={`${member.name} LinkedIn`}
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </LinkedInLink>
              </MemberItem>
            ))}
          </TeamCard>
        ))}
      </TeamGrid>

      <StatsPanel aria-label="Team statistics">
        {teamStats.map((item) => (
          <StatCard key={item.label}>
            <span aria-hidden="true">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <strong>{item.value}</strong>
            <small>{item.label}</small>
          </StatCard>
        ))}
      </StatsPanel>
    </TeamPage>
  );
}

export default Team;
