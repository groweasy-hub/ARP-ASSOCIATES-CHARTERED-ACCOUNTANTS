import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const FooterSection = styled.footer`
  padding: 34px 100px 20px;
  color: #26395d;
  background:
    radial-gradient(
      circle at 4% 8%,
      rgba(2, 84, 160, 0.08) 0 12%,
      transparent 30%
    ),
    radial-gradient(
      circle at 96% 84%,
      rgba(2, 84, 160, 0.06) 0 16%,
      transparent 34%
    ),
    #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 30px 46px 18px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
    background: #ffffff;
  }
`;

export const FooterInner = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1.28fr) minmax(180px, 0.82fr) minmax(
      330px,
      1fr
    );
  gap: 42px;
  width: min(100%, 1420px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    width: 100%;
    padding: 22px 22px 0;
    background:
      radial-gradient(circle at 10% 12%, rgba(2, 84, 160, 0.06) 0 18%, transparent 42%),
      rgba(255, 255, 255, 0.98);
    border: 0;
    border-bottom: 0;
    border-radius: 0;
    box-sizing: border-box;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 20px 18px 0;
  }
`;

export const FooterColumn = styled.div`
  min-height: 182px;

  & + & {
    padding-left: 64px;
    border-left: 1px solid rgba(13, 34, 68, 0.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    & + & {
      padding-left: 34px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 0;

    & + & {
      padding-left: 0;
      border-left: 0;
    }

    &:nth-child(2) {
      display: none;
    }

    &:nth-child(3) {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(13, 34, 68, 0.12);
    }
  }
`;

export const FooterBrand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

export const FooterBrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 38px;
  }
`;

export const FooterBrandLogo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const FooterBrandDivider = styled.span`
  width: 1px;
  height: 34px;
  margin: 0 10px 0 6px;
  background: #526280;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 32px;
    margin: 0 10px 0 8px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 28px;
    margin: 0 8px 0 6px;
  }
`;

export const FooterBrandText = styled.span`
  display: grid;
  gap: 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 4px;
  }
`;

export const FooterBrandName = styled.span`
  color: #15467c;
  font-family:
    "Montserrat", "Avenir Next", "Gotham",
    ${({ theme }) => theme.typography.fontHeading};
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    color: #0254a0;
    font-size: 1.08rem;
    letter-spacing: 0.04em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 0.98rem;
  }
`;

export const FooterBrandTagline = styled.span`
  color: #526280;
  font-family:
    "Montserrat", "Avenir Next", "Gotham",
    ${({ theme }) => theme.typography.fontBody};
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: 0.32em;
  line-height: 1;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.5rem;
    letter-spacing: 0.2em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 0.45rem;
    letter-spacing: 0.16em;
  }
`;

export const FooterCopy = styled.p`
  max-width: 360px;
  margin: 22px 0 20px;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.75;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
    margin: 18px 0 16px;
    color: #26395d;
    font-size: 0.68rem;
    line-height: 1.45;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 0.64rem;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-start;
    max-width: none;
    margin-bottom: 18px;
    gap: 12px;
  }
`;

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #0254a0;
  font-size: 15px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  background: #eaf3fb;
  border-radius: 50%;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #ffffff;
    background: #0254a0;
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 34px;
    height: 34px;
    font-size: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
`;

export const FooterTitle = styled.h2`
  margin: 0;
  color: #0d2244;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.2;

  &::after {
    display: block;
    width: 42px;
    height: 3px;
    margin-top: 12px;
    content: "";
    background: #0254a0;
    border-radius: ${({ theme }) => theme.radius.full};
  }
`;

export const FooterLinks = styled.nav`
  display: grid;
  gap: 12px;
  margin-top: 22px;
`;

export const FooterLink = styled(NavLink)`
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.05;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover,
  &.active {
    color: #0254a0;
  }
`;

export const ContactList = styled.div`
  display: grid;
  gap: 18px;
  margin-top: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 12px;
    margin-top: 0;

    &::before {
      display: block;
      content: "Contact Us";
      color: #0d2244;
      font-size: 0.9rem;
      font-weight: ${({ theme }) => theme.typography.weight.bold};
      line-height: 1.2;
      order: -2;
    }

    &::after {
      display: block;
      width: 38px;
      height: 3px;
      margin-top: -6px;
      content: "";
      background: #0254a0;
      border-radius: ${({ theme }) => theme.radius.full};
      order: -1;
    }
  }
`;

export const ContactItem = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.4;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 10px;
    color: #26395d;
    font-size: 0.66rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 8px;
    font-size: 0.62rem;
  }
`;

export const ContactIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 28px;
    height: 28px;

    svg {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 26px;
    height: 26px;
  }
`;

export const ConsultationButton = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 0 0 auto;
  min-width: 200px;
  height: 44px;
  margin-top: 28px;
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
  box-shadow: ${({ theme }) => theme.shadows.lg};
  box-sizing: border-box;
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  svg {
    flex: 0 0 auto;
    width: ${({ theme }) => theme.typography.size.sm};
    height: ${({ theme }) => theme.typography.size.sm};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 12px;
    min-width: 176px;
    height: 42px;
    padding: 0 18px;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 8px;
    width: 100%;
    min-width: 0;
    height: 38px;
    margin-top: 18px;
    padding: 0 14px;
    font-size: 0.68rem;
    box-shadow: none;
  }
`;

export const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 1420px);
  margin: 38px auto 0;
  padding-top: 22px;
  color: #526280;
  font-size: ${({ theme }) => theme.typography.size.xs};
  border-top: 1px solid rgba(13, 34, 68, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    justify-items: center;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 16px 20px 20px;
    color: #33425e;
    font-size: 0.62rem;
    line-height: 1.35;
    text-align: center;
    background: rgba(255, 255, 255, 0.98);
    border: 0;
    border-top: 1px solid rgba(13, 34, 68, 0.12);
    border-radius: 0;
    box-sizing: border-box;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > span {
      display: block;
      width: 100%;
      text-align: center;
    }
  }
`;

export const BottomLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 38px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 18px;
    margin-top: 10px;
  }
`;

export const LegalLink = styled(NavLink)`
  position: relative;
  color: #26395d;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  & + &::before {
    position: absolute;
    top: 50%;
    left: -20px;
    width: 1px;
    height: 16px;
    content: "";
    background: rgba(13, 34, 68, 0.22);
    transform: translateY(-50%);
  }

  &:hover {
    color: #0254a0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.62rem;
    white-space: nowrap;

    & + &::before {
      left: -10px;
      height: 10px;
    }
  }
`;
