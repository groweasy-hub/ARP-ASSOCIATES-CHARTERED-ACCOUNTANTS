import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faBriefcase,
  faEnvelope,
  faHome,
  faLink,
  faLocationDot,
  faPhone,
  faUser,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import {
  Brand,
  BrandDivider,
  BrandLogo,
  BrandMark,
  BrandName,
  BrandTagline,
  BrandText,
  ConsultationIcon,
  ConsultationLink,
  DrawerBrand,
  DrawerClose,
  DrawerContactIcon,
  DrawerContactItem,
  DrawerContactList,
  DrawerFooter,
  DrawerLegalLink,
  DrawerLegalLinks,
  DrawerNav,
  DrawerNavIcon,
  DrawerNavLink,
  DrawerOverlay,
  DrawerPanel,
  DrawerSocialLink,
  DrawerSocials,
  DrawerTop,
  HeaderInner,
  MenuButton,
  MobileDrawer,
  SiteHeader,
  SiteNav,
  SiteNavLink,
} from "./Header.styles";
import brand from "../../data/brand.json";

const navItems = [
  { label: "Home", path: "/", icon: faHome },
  { label: "About Us", path: "/about", icon: faUser },
  { label: "Services", path: "/services", icon: faBriefcase },
  { label: "Team", path: "/team", icon: faUsers },
  { label: "Links", path: "/links", icon: faLink },
  { label: "Contact Us", path: "/contact", icon: faEnvelope },
];

const contactItems = [
  { label: brand.phone, icon: faPhone },
  { label: brand.email, icon: faEnvelope },
  { label: brand.shortAddress, icon: faLocationDot },
];

const socialLinks = [
  { label: "LinkedIn", icon: faLinkedinIn, path: "#" },
  { label: "Facebook", icon: faFacebookF, path: "#" },
  { label: "WhatsApp", icon: faWhatsapp, path: "#" },
  { label: "Instagram", icon: faInstagram, path: "#" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <SiteHeader>
      <HeaderInner>
        <Brand to="/" aria-label={`${brand.name} home`}>
          <BrandMark>
            <BrandLogo src={brand.logoPath} alt={`${brand.name} logo`} />
          </BrandMark>
          <BrandDivider aria-hidden="true" />
          <BrandText>
            <BrandName>{brand.name}</BrandName>
            <BrandTagline>{brand.tagline}</BrandTagline>
          </BrandText>
        </Brand>

        <SiteNav aria-label="Primary navigation">
          {navItems.map((item) => (
            <SiteNavLink end={item.path === "/"} key={item.path} to={item.path}>
              {item.label}
            </SiteNavLink>
          ))}
        </SiteNav>

        <ConsultationLink to="/contact">
          <ConsultationIcon aria-hidden="true">
            <FontAwesomeIcon icon={faPhone} />
          </ConsultationIcon>
          Book a Consultation
        </ConsultationLink>

        <MenuButton
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
        </MenuButton>
      </HeaderInner>

      <MobileDrawer id="mobile-menu" $open={isMenuOpen} aria-hidden={!isMenuOpen}>
        <DrawerOverlay type="button" aria-label="Close menu" onClick={closeMenu} />
        <DrawerPanel $open={isMenuOpen} role="dialog" aria-modal="true" aria-label="Mobile menu">
          <DrawerTop>
            <DrawerBrand to="/" aria-label={`${brand.name} home`} onClick={closeMenu}>
              <BrandMark>
                <BrandLogo src={brand.logoPath} alt={`${brand.name} logo`} />
              </BrandMark>
              <BrandDivider aria-hidden="true" />
              <BrandText>
                <BrandName>{brand.name}</BrandName>
                <BrandTagline>{brand.tagline}</BrandTagline>
              </BrandText>
            </DrawerBrand>

            <DrawerClose type="button" aria-label="Close menu" onClick={closeMenu}>
              <FontAwesomeIcon icon={faXmark} />
            </DrawerClose>
          </DrawerTop>

          <DrawerNav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <DrawerNavLink
                end={item.path === "/"}
                key={item.path}
                to={item.path}
                onClick={closeMenu}
              >
                <DrawerNavIcon aria-hidden="true">
                  <FontAwesomeIcon icon={item.icon} />
                </DrawerNavIcon>
                <span>{item.label}</span>
                {item.path === "/services" && (
                  <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                )}
              </DrawerNavLink>
            ))}
          </DrawerNav>

          <DrawerContactList>
            {contactItems.map((item) => (
              <DrawerContactItem key={item.label}>
                <DrawerContactIcon aria-hidden="true">
                  <FontAwesomeIcon icon={item.icon} />
                </DrawerContactIcon>
                <span>{item.label}</span>
              </DrawerContactItem>
            ))}
          </DrawerContactList>

          <ConsultationLink to="/contact" onClick={closeMenu}>
            <ConsultationIcon aria-hidden="true">
              <FontAwesomeIcon icon={faPhone} />
            </ConsultationIcon>
            Book a Consultation
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </ConsultationLink>

          <DrawerSocials aria-label="Social links">
            {socialLinks.map((item) => (
              <DrawerSocialLink key={item.label} href={item.path} aria-label={item.label}>
                <FontAwesomeIcon icon={item.icon} />
              </DrawerSocialLink>
            ))}
          </DrawerSocials>

          <DrawerFooter>
            <span>&copy; {currentYear} {brand.fullName}. All rights reserved.</span>
            <DrawerLegalLinks>
              <DrawerLegalLink to="/privacy-policy" onClick={closeMenu}>
                Privacy Policy
              </DrawerLegalLink>
              <DrawerLegalLink to="/terms-of-use" onClick={closeMenu}>
                Terms of Use
              </DrawerLegalLink>
              <DrawerLegalLink to="/disclaimer" onClick={closeMenu}>
                Disclaimer
              </DrawerLegalLink>
            </DrawerLegalLinks>
          </DrawerFooter>
        </DrawerPanel>
      </MobileDrawer>
    </SiteHeader>
  );
}

export default Header;
