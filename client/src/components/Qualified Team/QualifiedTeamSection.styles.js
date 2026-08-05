import styled from "styled-components";

export const QualifiedSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 50px 100px 72px;
  background:
    radial-gradient(circle at 0% 0%, rgba(2, 84, 160, 0.08) 0 12%, transparent 28%),
    radial-gradient(circle at 100% 100%, rgba(2, 84, 160, 0.07) 0 18%, transparent 34%),
    #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 44px 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 48px 0 58px;
    background:
      radial-gradient(circle at 50% 42%, rgba(2, 84, 160, 0.06) 0 18%, transparent 42%),
      #ffffff;
  }
`;

export const SectionHeader = styled.div`
  max-width: 680px;
  margin: 0 auto 40px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 330px;
    margin-bottom: 34px;
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
    max-width: 295px;
    margin: 18px auto 20px;
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

export const QualifiedContent = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(390px, 0.86fr) minmax(520px, 1.14fr);
  gap: 38px;
  width: min(100%, 1420px);
  min-height: 440px;
  margin: 0 auto;
  padding: 42px 46px 40px;
  overflow: hidden;
  background: transparent;
  border: 0;
  border-radius: 18px;
  box-sizing: border-box;

  &::after {
    position: absolute;
    top: 54px;
    right: 34px;
    width: 180px;
    height: 150px;
    content: "";
    opacity: 0.22;
    background-image: radial-gradient(circle, #0254a0 2px, transparent 2.5px);
    background-size: 22px 22px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(400px, 0.9fr) minmax(520px, 1.1fr);
    gap: 30px;
    min-height: 400px;
    padding: 36px 34px 34px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    width: min(100%, 360px);
    min-height: 0;
    padding: 0;
    overflow: visible;

    &::after {
      display: none;
    }
  }
`;

export const SectionCopy = styled.div`
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  p {
    max-width: 540px;
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.base};
    font-weight: ${({ theme }) => theme.typography.weight.regular};
    line-height: 1.65;

    strong {
      color: #0254a0;
      font-weight: ${({ theme }) => theme.typography.weight.bold};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
      font-size: ${({ theme }) => theme.typography.size.base};
    }
  }
`;

export const CredentialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 82px);
  gap: 12px;
  margin-top: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, 76px);
    gap: 10px;
    margin-top: 24px;
  }
`;

export const CredentialCard = styled.div`
  display: grid;
  place-items: center;
  gap: 1px;
  height: 82px;
  color: #0d2244;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(13, 34, 68, 0.1);
  border-radius: 10px;
  box-sizing: border-box;
`;

export const CredentialIcon = styled.span`
  display: inline-flex;
  color: #0254a0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ImageFrame = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 360px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    min-height: 0;
    justify-items: center;
  }
`;

export const TeamImage = styled.img`
  position: relative;
  z-index: 1;
  display: block;
  width: min(100%, 620px);
  height: 360px;
  object-fit: contain;
  object-position: center bottom;
  transform: translateY(-42px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(118%, 390px);
    height: 245px;
    margin-left: -9%;
    margin-right: -9%;
    object-fit: contain;
    transform: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 220px;
  }
`;

export const FeatureCard = styled.div`
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(78px, 1fr));
  width: min(86%, 480px);
  min-height: 74px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 10px 22px rgba(13, 34, 68, 0.08);
  box-sizing: border-box;
  transform: translateX(-50%);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: relative;
    left: auto;
    bottom: auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
    width: 100%;
    min-height: 0;
    margin-top: -18px;
    padding: 8px 10px;
    border: 1px solid rgba(13, 34, 68, 0.08);
    border-radius: 8px;
    box-shadow: 0 14px 28px rgba(13, 34, 68, 0.08);
    transform: none;
  }
`;

export const FeatureItem = styled.div`
  position: relative;
  display: grid;
  justify-items: center;
  gap: 5px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    justify-items: center;
    gap: 7px;
    min-height: 82px;
    padding: 10px 8px;
    text-align: center;
  }
`;

export const FeatureIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #0254a0;
  background: #eef6fd;
  border-radius: 50%;

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 36px;
    height: 36px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

export const FeatureText = styled.span`
  max-width: 84px;
  color: #0d2244;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: 1.25;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 96px;
    font-size: 0.68rem;
    line-height: 1.18;
  }
`;

export const FeatureDivider = styled.span`
  position: absolute;
  top: 7px;
  right: 0;
  width: 1px;
  height: 44px;
  background: rgba(13, 34, 68, 0.12);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
