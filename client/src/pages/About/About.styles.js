import styled from "styled-components";
export const AboutPage = styled.section`
  padding: 0 100px 72px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 0 48px;
  }
`;

export const AboutHero = styled.div`
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
    margin-left: 0;
    margin-right: 0;
    padding: 42px 24px 38px;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 12px;
  max-width: 760px;
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

export const Badge = styled.span`
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
  margin: 0;
  color: #0d2244;
  font-size: 54px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.08;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 46px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.58rem;
  }
`;

export const HeroCopy = styled.h2`
  margin: 0;
  color: #0254a0;
  font-size: 38px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.15;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 32px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.05rem;
  }
`;

export const HeroDescription = styled.p`
  max-width: 690px;
  margin: 4px 0 0;
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.55;
  text-align: center;
`;

export const WhoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(390px, 0.78fr) minmax(580px, 1.22fr);
  gap: 70px;
  width: min(100%, 1280px);
  margin: 64px auto 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    width: min(calc(100% - 36px), 640px);
    margin-top: 44px;
  }
`;

export const TextColumn = styled.div`
  align-self: center;
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

export const SectionTitle = styled.h2`
  margin: 28px 0 0;
  color: #0d2244;
  font-size: 36px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.18;

  strong {
    color: #0254a0;
    font-weight: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 31px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 20px;
    font-size: 1.18rem;
  }
`;

export const SectionIntro = styled.p`
  max-width: 520px;
  margin: 22px 0 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.75;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

export const FeatureCard = styled.article`
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 28px;
  min-height: 150px;
  padding: 26px 30px;
  border-color: rgba(13, 34, 68, 0.12);

  &:nth-child(1),
  &:nth-child(2) {
    border-bottom: 1px solid rgba(13, 34, 68, 0.12);
  }

  &:nth-child(1),
  &:nth-child(3) {
    border-right: 1px solid rgba(13, 34, 68, 0.12);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 14px;
    min-height: 0;
    padding: 16px 0;
    border: 0;
    border-bottom: 1px solid rgba(13, 34, 68, 0.1);
    border-radius: 0;

    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      border-right: 0;
      border-bottom: 1px solid rgba(13, 34, 68, 0.1);
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  h2 {
    margin: 0 0 12px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.65;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      margin-bottom: 8px;
      font-size: 0.92rem;
    }

    p {
      font-size: 0.82rem;
      line-height: 1.55;
    }
  }
`;

export const FeatureIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 44px;
    height: 44px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const StatsBand = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(100%, 1280px);
  min-height: 190px;
  margin: 74px auto 0;
  padding: 26px 34px;
  background: #f6fbff;
  border-radius: 10px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(calc(100% - 36px), 640px);
    min-height: 0;
    margin-top: 44px;
    padding: 0;
    gap: 0;
    background: transparent;
    border-radius: 0;
  }
`;

export const StatCard = styled.div`
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
  text-align: center;

  & + & {
    border-left: 1px solid rgba(13, 34, 68, 0.16);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 96px;
    padding: 14px 6px;
    border: 0;
    border-radius: 0;

    & + & {
      border-left: 0;
    }

    &:nth-child(odd) {
      border-right: 1px solid rgba(13, 34, 68, 0.1);
    }

    &:nth-child(n + 3) {
      border-top: 1px solid rgba(13, 34, 68, 0.1);
    }
  }

  strong {
    margin-top: 8px;
    color: #0254a0;
    font-size: 38px;
    line-height: 1;
  }

  span {
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.sm};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 6px;

    strong {
      margin-top: 4px;
      font-size: 1.42rem;
    }

    span {
      font-size: 0.78rem;
      line-height: 1.25;
    }
  }
`;

export const SectionHeader = styled.div`
  max-width: 660px;
  margin: 60px auto 34px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(calc(100% - 36px), 640px);
    margin-top: 48px;
    margin-bottom: 22px;
  }

  ${SectionEyebrow} {
    justify-items: center;
  }

  ${SectionTitle} {
    margin-top: 24px;
  }

  ${SectionIntro} {
    max-width: 570px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: min(100%, 1240px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    width: min(calc(100% - 36px), 640px);
    gap: 0;
  }
`;

export const WhyCard = styled.article`
  display: grid;
  justify-items: center;
  min-height: 246px;
  padding: 38px 38px 34px;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.1);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(13, 34, 68, 0.05);

  > svg {
    width: 48px;
    height: 48px;
    color: #0254a0;
  }

  h2 {
    margin: 28px 0 14px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.2;
  }

  p {
    max-width: 250px;
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.7;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 0;
    padding: 20px 0;
    background: transparent;
    border: 0;
    border-bottom: 1px solid rgba(13, 34, 68, 0.1);
    border-radius: 0;
    box-shadow: none;

    &:last-child {
      border-bottom: 0;
    }

    > svg {
      width: 32px;
      height: 32px;
    }

    h2 {
      margin: 14px 0 8px;
      font-size: 0.82rem;
    }

    p {
      font-size: 0.74rem;
      line-height: 1.45;
    }
  }
`;

export const OfficesSection = styled.section`
  width: min(100%, 1240px);
  margin: 58px auto 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(calc(100% - 36px), 640px);
    margin-top: 48px;
  }

  ${SectionIntro} {
    max-width: none;
    margin-top: 18px;
  }
`;

export const OfficeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px;
  margin-top: 34px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const OfficeCard = styled.article`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 34px;
  min-height: 168px;
  padding: 34px;
  background: #f6fbff;
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 14px;
    padding: 18px 0;
    background: transparent;
    border-top: 1px solid rgba(13, 34, 68, 0.1);
    border-radius: 0;
  }

  h2 {
    margin: 0 0 18px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.2;
  }

  p {
    margin: 0 0 8px;
    color: #26395d;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.45;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      margin-bottom: 10px;
      font-size: 0.82rem;
    }

    p {
      margin-bottom: 6px;
      font-size: 0.74rem;
      line-height: 1.4;
    }
  }
`;

export const OfficeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 44px;
    height: 44px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;
