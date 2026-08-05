import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import {
  BottomBar,
  BottomLinks,
  ContactIcon,
  ContactItem,
  ContactList,
  ConsultationButton,
  FooterBrand,
  FooterBrandDivider,
  FooterBrandLogo,
  FooterBrandMark,
  FooterBrandName,
  FooterBrandTagline,
  FooterBrandText,
  FooterColumn,
  FooterCopy,
  FooterInner,
  FooterLink,
  FooterLinks,
  FooterSection,
  FooterTitle,
  LegalLink,
  SocialLink,
  SocialLinks,
} from "./Footer.styles";
import brand from "../../data/brand.json";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Team", path: "/team" },
  { label: "Links", path: "/links" },
  { label: "Contact Us", path: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", icon: faLinkedinIn, path: "#" },
  { label: "Facebook", icon: faFacebookF, path: "#" },
  { label: "WhatsApp", icon: faWhatsapp, path: "#" },
  { label: "Instagram", icon: faInstagram, path: "#" },
];

const contactItems = [
  { label: brand.phone, icon: faPhone },
  { label: brand.email, icon: faEnvelope },
  { label: brand.shortAddress, icon: faLocationDot },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterSection>
      <FooterInner>
        <FooterColumn>
          <FooterBrand to="/" aria-label={`${brand.name} home`}>
            <FooterBrandMark>
              <FooterBrandLogo src={brand.logoPath} alt={`${brand.name} logo`} />
            </FooterBrandMark>
            <FooterBrandDivider aria-hidden="true" />
            <FooterBrandText>
              <FooterBrandName>{brand.name}</FooterBrandName>
              <FooterBrandTagline>{brand.tagline}</FooterBrandTagline>
            </FooterBrandText>
          </FooterBrand>

          <FooterCopy>
            Delivering trusted accounting, taxation, advisory and compliance
            services to help businesses grow with clarity and confidence.
          </FooterCopy>

          <SocialLinks aria-label="Social links">
            {socialLinks.map((item) => (
              <SocialLink
                key={item.label}
                href={item.path}
                aria-label={item.label}
              >
                <FontAwesomeIcon icon={item.icon} />
              </SocialLink>
            ))}
          </SocialLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLinks>
            {quickLinks.map((item) => (
              <FooterLink key={item.path} to={item.path}>
                {item.label}
              </FooterLink>
            ))}
          </FooterLinks>
        </FooterColumn>

        <FooterColumn>
          <ContactList>
            {contactItems.map((item) => (
              <ContactItem key={item.label}>
                <ContactIcon aria-hidden="true">
                  <FontAwesomeIcon icon={item.icon} />
                </ContactIcon>
                <span>{item.label}</span>
              </ContactItem>
            ))}
          </ContactList>

          <ConsultationButton to="/contact">
            Book a Consultation
            <FontAwesomeIcon icon={faArrowRight} />
          </ConsultationButton>
        </FooterColumn>
      </FooterInner>

      <BottomBar>
        <span>&copy; {currentYear} {brand.fullName}. All rights reserved.</span>
        <BottomLinks>
          <LegalLink to="/privacy-policy">Privacy Policy</LegalLink>
          <LegalLink to="/terms-of-use">Terms of Use</LegalLink>
          <LegalLink to="/disclaimer">Disclaimer</LegalLink>
        </BottomLinks>
      </BottomBar>
    </FooterSection>
  );
}

export default Footer;
