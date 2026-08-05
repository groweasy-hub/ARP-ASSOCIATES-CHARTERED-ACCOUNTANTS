import styled from "styled-components";

export const TeamPage = styled.section`
  padding: 0 100px 72px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 18px 48px;
  }
`;

export const TeamHero = styled.div`
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
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
  gap: 12px;
  max-width: 820px;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: #0d2244;
  font-size: 48px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.08;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.62rem;
  }
`;

export const HeroSubtitle = styled.h2`
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
  margin: 8px 0 0;
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.55;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.86rem;
    line-height: 1.45;
  }
`;

export const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: min(100%, 1280px);
  min-height: 150px;
  margin: 28px auto 0;
  padding: 24px 34px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    min-height: 0;
    padding: 12px 8px;
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
    min-height: 92px;
    gap: 6px;
    padding: 8px 4px;

    & + & {
      border-left: 1px solid rgba(13, 34, 68, 0.12);
      border-top: 0;
    }
  }

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    color: #0254a0;
    background: #eaf3fb;
    border-radius: 50%;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  strong {
    color: #0254a0;
    font-size: 34px;
    line-height: 1;
  }

  small {
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.sm};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > span {
      width: 34px;
      height: 34px;
    }

    svg {
      width: 15px;
      height: 15px;
    }

    strong {
      font-size: 1.28rem;
    }

    small {
      max-width: 78px;
      font-size: 0.64rem;
      line-height: 1.2;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    > span {
      width: 30px;
      height: 30px;
    }

    strong {
      font-size: 1.12rem;
    }

    small {
      max-width: 66px;
      font-size: 0.58rem;
    }
  }
`;

export const SectionHeader = styled.div`
  max-width: 600px;
  margin: 34px auto 28px;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #0d2244;
  font-size: 31px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.2;

  &::after {
    display: block;
    width: 46px;
    height: 3px;
    margin: 12px auto 0;
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
  max-width: 520px;
  margin: 14px auto 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 10px;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px;
  width: min(100%, 1280px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
`;

export const TeamCard = styled.article`
  padding: 26px 30px 18px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(13, 34, 68, 0.04);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 18px 16px 12px;
  }
`;

export const TeamCardHeader = styled.header`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.12);

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    color: #ffffff;
    background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
    border-radius: 50%;
  }

  h2 {
    margin: 4px 0 10px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.2;
  }

  p {
    display: flex;
    gap: 10px;
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.55;
  }

  p svg {
    margin-top: 3px;
    color: #0254a0;
    flex: 0 0 auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 12px;
    padding-bottom: 14px;

    > span {
      width: 44px;
      height: 44px;
    }

    > span svg {
      width: 17px;
      height: 17px;
    }

    h2 {
      margin: 2px 0 6px;
      font-size: 0.82rem;
    }

    p {
      gap: 7px;
      font-size: 0.74rem;
      line-height: 1.4;
    }
  }
`;

export const MemberItem = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 36px;
  align-items: center;
  gap: 18px;
  min-height: 78px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.1);

  &:last-child {
    border-bottom: 0;
  }

  h3 {
    margin: 0 0 6px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.35;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 44px minmax(0, 1fr) 30px;
    gap: 12px;
    min-height: 64px;

    h3 {
      margin-bottom: 4px;
      font-size: 0.82rem;
    }

    p {
      font-size: 0.72rem;
    }
  }
`;

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $large }) => ($large ? "132px" : "52px")};
  height: ${({ $large }) => ($large ? "132px" : "52px")};
  color: #ffffff;
  font-size: ${({ $large }) => ($large ? "30px" : "14px")};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  background:
    radial-gradient(
      circle at 36% 30%,
      rgba(255, 255, 255, 0.28) 0 18%,
      transparent 19%
    ),
    linear-gradient(135deg, #0d2244 0%, #0254a0 100%);
  border-radius: 50%;
  flex: 0 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: ${({ $large }) => ($large ? "64px" : "44px")};
    height: ${({ $large }) => ($large ? "64px" : "44px")};
    font-size: ${({ $large }) => ($large ? "17px" : "12px")};
  }
`;

export const PartnerAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 132px;
  overflow: hidden;
  color: #ffffff;
  font-size: 30px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  background:
    radial-gradient(
      circle at 36% 30%,
      rgba(255, 255, 255, 0.28) 0 18%,
      transparent 19%
    ),
    linear-gradient(135deg, #0d2244 0%, #0254a0 100%);
  border-radius: 50%;
  flex: 0 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 64px;
    height: 64px;
    font-size: 17px;
  }
`;

export const PartnerAvatarImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const LinkedInLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #0254a0;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid rgba(2, 84, 160, 0.25);
  border-radius: 50%;

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const PartnerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: min(100%, 1260px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const PartnerCard = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) 36px;
  gap: 28px;
  min-height: 200px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 64px minmax(0, 1fr) 32px;
    align-items: start;
    gap: 14px;
    min-height: 0;
    padding: 18px;
  }

  h2 {
    margin: 8px 0 8px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.lg};
    line-height: 1.2;
  }

  strong {
    display: block;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.3;

    &::after {
      display: block;
      width: 40px;
      height: 2px;
      margin-top: 14px;
      content: "";
      background: #0254a0;
    }
  }

  p {
    max-width: 340px;
    margin: 20px 0 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.65;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      margin: 0 0 6px;
      font-size: 0.82rem;
    }

    strong {
      font-size: 0.74rem;

      &::after {
        margin-top: 10px;
      }
    }

    p {
      max-width: none;
      margin-top: 14px;
      font-size: 0.74rem;
      line-height: 1.55;
    }
  }
`;

export const ValuesBand = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: min(100%, 1300px);
  min-height: 170px;
  margin: 34px auto 0;
  padding: 26px 18px;
  background: #f6fbff;
  border-radius: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    padding: 18px;
  }
`;

export const ValueCard = styled.article`
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 12px;
  padding: 0 24px;
  text-align: center;

  & + & {
    border-left: 1px solid rgba(13, 34, 68, 0.14);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 18px 0;

    & + & {
      border-left: 0;
      border-top: 1px solid rgba(13, 34, 68, 0.12);
    }
  }

  > svg {
    width: 32px;
    height: 32px;
    color: #0254a0;
  }

  h2 {
    margin: 6px 0 0;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.55;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 8px;

    > svg {
      width: 24px;
      height: 24px;
    }

    h2 {
      font-size: 0.82rem;
    }

    p {
      font-size: 0.72rem;
      line-height: 1.4;
    }
  }
`;
