import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SiteHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  background: rgba(255, 255, 255, 0.97);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background: rgba(255, 255, 255, 0.94);
  }
`;

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 1720px);
  height: 80px;
  margin: 0 auto;
  padding: 0 100px;
  box-sizing: border-box;
  gap: 26px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    height: 76px;
    padding: 0 28px;
    gap: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 72px;
    padding: 0 22px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 0 18px;
  }
`;

export const Brand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    min-width: 250px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: 0;
  }
`;

export const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 45px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    height: 38px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 36px;
  }
`;

export const BrandLogo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const BrandDivider = styled.span`
  width: 2px;
  height: 32px;
  margin-left: 5px;
  margin-right: 8px;
  background: #526280;
  flex: 0 0 1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    height: 34px;
    margin-left: 5px;
    margin-right: 8px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 30px;
    margin-left: 6px;
    margin-right: 8px;
  }
`;

export const BrandText = styled.span`
  display: grid;
  gap: 6px;
  align-content: center;
`;

export const BrandName = styled.span`
  color: #0254a0;
  font-family:
    "Montserrat", "Avenir Next", "Gotham",
    ${({ theme }) => theme.typography.fontHeading};
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 18px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 14px;
  }
`;

export const BrandTagline = styled.span`
  color: #526280;
  font-family:
    "Montserrat", "Avenir Next", "Gotham",
    ${({ theme }) => theme.typography.fontBody};
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: 0.32em;
  line-height: 1;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 9px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 7.5px;
    letter-spacing: 0.24em;
  }
`;

export const SiteNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 38px;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const SiteNavLink = styled(NavLink)`
  position: relative;
  color: #26395d;
  font-size: 15px;
  font-weight: 500;
  line-height: 82px;
  text-decoration: none;
  white-space: nowrap;
  transition: color ${({ theme }) => theme.transitions.fast};

  &::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 26px;
    height: 3px;
    content: "";
    background: #0254a0;
    border-radius: ${({ theme }) => theme.radius.full};
    opacity: 0;
    transform: scaleX(0.5);
    transition:
      opacity ${({ theme }) => theme.transitions.fast},
      transform ${({ theme }) => theme.transitions.fast};
  }

  &:hover,
  &.active {
    color: #0254a0;
  }

  &.active::after {
    opacity: 1;
    transform: scaleX(1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 15px;
    line-height: 76px;
  }
`;

export const ConsultationLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 0 0 auto;
  min-width: 200px;
  height: 44px;
  padding: 0 24px;
  color: #ffffff;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  box-sizing: border-box;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 12px;
    min-width: 176px;
    height: 42px;
    padding: 0 18px;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const ConsultationIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  width: ${({ theme }) => theme.typography.size.sm};
  height: ${({ theme }) => theme.typography.size.sm};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  padding: 0;
  color: #071b45;
  font-size: 28px;
  line-height: 1;
  background: transparent;
  border: 0;
  cursor: pointer;

  svg {
    width: 30px;
    height: 30px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: inline-flex;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 42px;
    height: 42px;

    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

export const MobileDrawer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: none;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

export const DrawerOverlay = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  background: rgba(0, 0, 0, 0.52);
  border: 0;
  opacity: 0;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.base};

  ${MobileDrawer}[aria-hidden="false"] & {
    opacity: 1;
  }
`;

export const DrawerPanel = styled.aside`
  position: absolute;
  inset: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  width: min(88vw, 430px);
  max-width: calc(100vw - 54px);
  height: 100vh;
  height: 100dvh;
  padding: 22px 22px 18px;
  overflow: hidden;
  color: #071b45;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 0 18px 18px 0;
  box-shadow: 18px 0 42px rgba(7, 27, 69, 0.2);
  box-sizing: border-box;
  transform: translateX(${({ $open }) => ($open ? "0" : "-104%")});
  transition: transform ${({ theme }) => theme.transitions.base};

  ${ConsultationLink} {
    display: inline-flex;
    width: 100%;
    min-width: 0;
    height: 48px;
    margin: 14px 0 16px;
    gap: 12px;
    padding: 0 18px;
    font-size: 0.94rem;
    box-shadow: none;
  }

  ${ConsultationIcon} {
    width: 14px;
    height: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: calc(100vw - 38px);
    max-width: calc(100vw - 38px);
    padding: 18px 18px 16px;
  }
`;

export const DrawerTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

export const DrawerBrand = styled(Brand)`
  min-width: 0;

  ${BrandMark} {
    height: 34px;
  }

  ${BrandName} {
    font-size: 14px;
  }

  ${BrandTagline} {
    font-size: 6.8px;
    letter-spacing: 0.22em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    ${BrandMark} {
      height: 30px;
    }

    ${BrandName} {
      font-size: 12px;
    }

    ${BrandTagline} {
      font-size: 5.8px;
      letter-spacing: 0.18em;
    }
  }
`;

export const DrawerClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  padding: 0;
  color: #071b45;
  font-size: 22px;
  background: transparent;
  border: 0;
  cursor: pointer;

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const DrawerNav = styled.nav`
  display: grid;
  gap: 4px;
  margin-top: 22px;
`;

export const DrawerNavIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #071b45;
  font-size: 18px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const DrawerNavLink = styled(NavLink)`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  color: #071b45;
  font-size: 0.88rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  border-radius: 10px;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  > svg {
    justify-self: end;
    width: 12px;
    height: 12px;
  }

  &.active,
  &:hover {
    color: #0254a0;
    background: #eef6fd;
  }

  &.active ${DrawerNavIcon},
  &:hover ${DrawerNavIcon} {
    color: #0254a0;
  }
`;

export const DrawerContactList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(13, 34, 68, 0.12);
`;

export const DrawerContactItem = styled.div`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  color: #33425e;
  font-size: 0.78rem;
  line-height: 1.25;
`;

export const DrawerContactIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const DrawerSocials = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 14px 0 16px;
  border-top: 1px solid rgba(13, 34, 68, 0.12);
  border-bottom: 1px solid rgba(13, 34, 68, 0.12);
`;

export const DrawerSocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 34px;
  height: 34px;
  color: #0254a0;
  font-size: 15px;
  text-decoration: none;
  background: #eaf3fb;
  border-radius: 50%;
`;

export const DrawerFooter = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
  padding-top: 12px;
  color: #33425e;
  font-size: 0.68rem;
  line-height: 1.35;
  text-align: center;
`;

export const DrawerLegalLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 14px;
`;

export const DrawerLegalLink = styled(NavLink)`
  color: #26395d;
  font-size: 0.7rem;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: #0254a0;
  }
`;
