import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const ServiceDetailPage = styled.section`
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
    radial-gradient(circle at 50% 42%, rgba(2, 84, 160, 0.06) 0 12%, transparent 30%),
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

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 14px;
  max-width: 880px;
  text-align: center;
`;

export const BackLink = styled.button`
  position: absolute;
  top: 32px;
  left: 100px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 0 16px;
  color: #0254a0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  background: #eaf3fb;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #ffffff;
    background: #0254a0;
    transform: translateX(-2px);
  }

  svg {
    width: 13px;
    height: 13px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    top: 28px;
    left: 46px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: 22px;
    left: 24px;
    min-height: 32px;
    padding: 0 14px;
    font-size: 0.78rem;
  }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: #0d2244;
  font-size: 52px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.08;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 44px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.62rem;
  }
`;

export const HeroDescription = styled.p`
  max-width: 720px;
  margin: 0;
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.65;
`;

export const IntroPanel = styled.div`
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 30px;
  width: min(100%, 1180px);
  margin: 64px auto 0;
  padding: 38px;
  background: #f6fbff;
  border-radius: 8px;
  box-sizing: border-box;

  > svg {
    align-self: start;
    width: 42px;
    height: 42px;
    padding: 20px;
    color: #0254a0;
    background: #ffffff;
    border-radius: 50%;
  }

  p {
    max-width: 930px;
    margin: 18px 0 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.75;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    gap: 18px;
    margin-top: 44px;
    padding: 24px 20px;

    > svg {
      width: 28px;
      height: 28px;
      padding: 16px;
    }
  }
`;

export const SectionEyebrow = styled.span`
  display: inline-grid;
  gap: 14px;
  color: #0254a0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.2;
  text-transform: uppercase;

  &::after {
    display: block;
    width: 38px;
    height: 2px;
    content: "";
    background: #0254a0;
  }
`;

export const SectionHeader = styled.div`
  max-width: 700px;
  margin: 66px auto 34px;
  text-align: center;

  ${SectionEyebrow} {
    justify-items: center;
  }
`;

export const SectionTitle = styled.h2`
  margin: 22px 0 0;
  color: #0d2244;
  font-size: 34px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.18;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 30px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.18rem;
  }
`;

export const SectionIntro = styled.p`
  margin: 18px 0 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.75;
`;

export const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: min(100%, 1180px);
  margin: 28px auto 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ContentGrid = styled(SplitGrid)`
  margin-top: 62px;
`;

export const CapabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  width: min(100%, 1180px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const InfoCard = styled.article`
  min-height: 100%;
  padding: 30px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.1);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(13, 34, 68, 0.05);
  box-sizing: border-box;

  > svg {
    width: 28px;
    height: 28px;
    color: #0254a0;
  }

  h2 {
    margin: 20px 0 16px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.2;
  }

  p {
    margin: 18px 0 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.7;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 22px;

    h2 {
      font-size: 0.98rem;
    }

    p {
      font-size: 0.8rem;
      line-height: 1.5;
    }
  }
`;

export const List = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 22px;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.6;
  }

  li::before {
    position: absolute;
    left: 0;
    top: 0.65em;
    width: 7px;
    height: 7px;
    content: "";
    background: #0254a0;
    border-radius: 50%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    li {
      font-size: 0.8rem;
      line-height: 1.5;
    }
  }
`;

export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: min(100%, 1180px);
  margin: 0 auto;
  background: #f6fbff;
  border-radius: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ProcessStep = styled.article`
  min-height: 210px;
  padding: 28px;
  border-right: 1px solid rgba(13, 34, 68, 0.1);
  box-sizing: border-box;

  &:last-child {
    border-right: 0;
  }

  span {
    display: block;
    color: #0254a0;
    font-size: 28px;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: 1;
  }

  p {
    margin: 24px 0 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.65;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 0;
    padding: 20px;
    border-right: 0;
    border-bottom: 1px solid rgba(13, 34, 68, 0.1);

    &:last-child {
      border-bottom: 0;
    }
  }
`;

export const ReferenceGrid = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 22px;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    color: #0254a0;
    font-size: ${({ theme }) => theme.typography.size.sm};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: 1.3;
    text-decoration: none;
  }

  svg {
    flex: 0 0 auto;
    width: 13px;
    height: 13px;
  }
`;

export const CTAButton = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-width: 180px;
  height: 44px;
  padding: 0 22px;
  color: #0254a0;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-decoration: none;
  white-space: nowrap;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const NotFoundPanel = styled.div`
  display: grid;
  justify-items: start;
  width: min(100%, 720px);
  margin: 80px auto;
  padding: 40px;
  background: #f6fbff;
  border-radius: 8px;
`;
