import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const ServicesPage = styled.section`
  padding: 0 100px 72px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 18px 48px;
  }
`;

export const Hero = styled.div`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: center;
  min-height: 430px;
  margin-left: -100px;
  margin-right: -100px;
  padding: 50px 140px 46px;
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(
      circle at 50% 42%,
      rgba(2, 84, 160, 0.06) 0 12%,
      transparent 30%
    ),
    #f6fbff;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    min-height: 390px;
    margin-left: -46px;
    margin-right: -46px;
    padding: 44px 86px 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 320px;
    margin-left: -18px;
    margin-right: -18px;
    padding: 42px 24px 38px;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
  max-width: 920px;
  text-align: center;
`;

export const DottedDecor = styled.span`
  position: absolute;
  ${({ $position }) =>
    $position === "left"
      ? "left: 70px; bottom: 88px;"
      : "right: 92px; top: 90px;"}
  width: 118px;
  height: 126px;
  opacity: 0.22;
  background-image: radial-gradient(circle, #0254a0 2px, transparent 2.5px);
  background-size: 22px 22px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 16px;
  color: #0254a0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-transform: uppercase;
  background: #eaf3fb;
  border-radius: ${({ theme }) => theme.radius.full};

  &::before {
    width: 7px;
    height: 7px;
    content: "";
    background: #0254a0;
    border-radius: 50%;
  }
`;

export const HeroTitle = styled.h1`
  max-width: 920px;
  margin: 0;
  color: #0d2244;
  font-size: 50px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.02;

  strong {
    display: block;
    color: #0254a0;
    font-weight: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.62rem;
  }
`;

export const HeroDescription = styled.p`
  max-width: 690px;
  margin: 0;
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.55;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.86rem;
    line-height: 1.45;
  }
`;

export const SectionHeader = styled.div`
  max-width: 600px;
  margin: 68px auto 64px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 44px auto 34px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #0d2244;
  font-size: 34px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.2;

  &::after {
    display: block;
    width: 50px;
    height: 3px;
    margin: 18px auto 0;
    content: "";
    background: #0254a0;
    border-radius: ${({ theme }) => theme.radius.full};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.18rem;

    &::after {
      width: 38px;
      margin-top: 10px;
    }
  }
`;

export const SectionIntro = styled.p`
  margin: 22px 0 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.75;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 12px;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: min(100%, 1260px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
`;

export const ServiceCard = styled.article`
  min-height: 310px;
  padding: 0 40px 50px;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: #f6fbff;
    box-shadow: 0 10px 24px rgba(13, 34, 68, 0.05);
  }

  &:nth-child(-n + 3) {
    border-bottom: 1px solid rgba(13, 34, 68, 0.14);
  }

  &:not(:nth-child(3n)) {
    border-right: 1px solid rgba(13, 34, 68, 0.14);
  }

  &:nth-child(n + 4) {
    padding-top: 54px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 0;
    padding: 18px;
    border: 1px solid rgba(13, 34, 68, 0.1);
    border-radius: 8px;

    &:nth-child(-n + 3),
    &:not(:nth-child(3n)) {
      border: 1px solid rgba(13, 34, 68, 0.1);
    }

    &:nth-child(n + 4) {
      padding-top: 22px;
    }
  }

  h2 {
    margin: 28px 0 20px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.2;
  }

  p {
    max-width: 300px;
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.75;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    margin-top: 30px;
    color: #0254a0;
    font-size: ${({ theme }) => theme.typography.size.sm};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    text-decoration: none;
    white-space: nowrap;
  }

  a svg {
    flex: 0 0 auto;
    width: 14px;
    height: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      margin: 16px 0 10px;
      font-size: 0.82rem;
    }

    p {
      font-size: 0.78rem;
      line-height: 1.45;
    }

    a {
      gap: 10px;
      margin-top: 16px;
      font-size: 0.72rem;
    }
  }
`;

export const ServiceIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 30px;
    height: 30px;
  }
`;

export const BenefitsBand = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(100%, 1280px);
  min-height: 170px;
  margin: 76px auto 0;
  padding: 30px 28px;
  background: #f6fbff;
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    margin-top: 44px;
    padding: 14px 16px;
  }
`;

export const BenefitCard = styled.article`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: center;
  gap: 22px;
  padding: 0 28px;

  & + & {
    border-left: 1px solid rgba(13, 34, 68, 0.16);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 12px;
    padding: 12px 0;

    & + & {
      border-left: 0;
      border-top: 1px solid rgba(13, 34, 68, 0.12);
    }
  }

  ${ServiceIcon} {
    width: 64px;
    height: 64px;
  }

  ${ServiceIcon} svg {
    width: 26px;
    height: 26px;
  }

  h2 {
    margin: 0 0 14px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.35;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.65;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${ServiceIcon} {
      width: 42px;
      height: 42px;
    }

    ${ServiceIcon} svg {
      width: 17px;
      height: 17px;
    }

    h2 {
      margin-bottom: 6px;
      font-size: 0.82rem;
    }

    p {
      font-size: 0.7rem;
      line-height: 1.35;
    }
  }
`;

export const CTASection = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) max-content;
  align-items: center;
  gap: 34px;
  width: min(100%, 1280px);
  min-height: 160px;
  margin: 72px auto 0;
  padding: 34px 38px;
  overflow: hidden;
  color: #ffffff;
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  border-radius: 8px;
  box-shadow: 0 18px 36px rgba(2, 84, 160, 0.18);
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 18px;
    min-height: 0;
    margin-top: 44px;
    padding: 28px 22px;
    text-align: center;
  }

  &::after {
    position: absolute;
    right: 270px;
    bottom: -90px;
    width: 420px;
    height: 220px;
    content: "";
    opacity: 0.16;
    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 50%;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      display: none;
    }
  }
`;

export const CTAIcon = styled.span`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  color: #0254a0;
  background: #ffffff;
  border-radius: 50%;

  svg {
    width: 27px;
    height: 27px;
  }
`;

export const CTAText = styled.div`
  position: relative;
  z-index: 1;

  h2 {
    margin: 0;
    color: #ffffff;
    font-size: 28px;
    line-height: 1.2;
  }

  p {
    margin: 14px 0 0;
    color: #ffffff;
    font-size: ${({ theme }) => theme.typography.size.base};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: 1.4;
  }
`;

export const CTAButton = styled(NavLink)`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 0 0 auto;
  min-width: 200px;
  height: 44px;
  padding: 0 24px;
  color: #0254a0;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  background: linear-gradient(135deg, rgb(235, 235, 235) 0%, #ffffff 100%);
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  box-sizing: border-box;

  svg {
    flex: 0 0 auto;
    width: ${({ theme }) => theme.typography.size.sm};
    height: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 12px;
    min-width: 176px;
    height: 42px;
    padding: 0 18px;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 12px;
    min-width: 0;
    height: 48px;
    padding: 0 18px;
    font-size: 0.82rem;
  }
`;
