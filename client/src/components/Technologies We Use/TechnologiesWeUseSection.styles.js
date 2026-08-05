import styled, { keyframes } from "styled-components";

const scrollLogos = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
`;

export const TechnologiesSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 50px 100px 72px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 44px 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 46px 0 54px;
  }
`;

export const SectionHeader = styled.div`
  max-width: 680px;
  margin: 0 auto 40px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 330px;
    margin-bottom: 30px;
    padding: 0 18px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #4d5870;
  font-size: ${({ theme }) => theme.typography.size.h4};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: 1.2;

  strong {
    color: #0d2244;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.typography.size.h5};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.18rem;
  }
`;

export const SectionIntro = styled.p`
  max-width: 620px;
  margin: 16px auto 22px;
  color: #4d5870;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: 1.55;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 12px auto 18px;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

export const Dots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 360px;
  height: 18px;
  margin: 0 auto;

  &::before,
  &::after {
    width: 155px;
    height: 1px;
    content: "";
    background: #e2e7ee;
  }

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  span:nth-child(1) {
    background: #0254a0;
  }

  span:nth-child(2) {
    background: #2c649c;
  }

  span:nth-child(3) {
    background: #173f7a;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 160px;
    height: 18px;
    gap: 6px;

    &::before,
    &::after {
      width: 54px;
    }

    span {
      width: 7px;
      height: 7px;
    }
  }
`;

export const LogoViewport = styled.div`
  width: min(100%, 1420px);
  margin: 0 auto;
  overflow: hidden;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 8%,
    #000 92%,
    transparent
  );

  &:hover div {
    animation-play-state: paused;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    mask-image: linear-gradient(
      90deg,
      transparent,
      #000 4%,
      #000 96%,
      transparent
    );
  }
`;

export const LogoTrack = styled.div`
  display: flex;
  width: max-content;
  gap: 22px;
  animation: ${scrollLogos} 28s linear infinite;
`;

export const TechnologyLogo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-width: 190px;
  height: 82px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(13, 34, 68, 0.05);
  box-sizing: border-box;
`;

export const LogoImage = styled.img`
  display: block;
  width: 42px;
  height: 42px;
  object-fit: contain;
`;

export const LogoName = styled.span`
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;
