import styled, { keyframes } from "styled-components";

const floatVertical = keyframes`
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }

  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
`;

const heroTextReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(22px);
    filter: blur(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const gentleTextFloat = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
`;

export const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 82px);
  border-bottom: 1px solid #e8edf4;
  background:
    radial-gradient(
      circle at 77% 37%,
      rgba(44, 100, 156, 0.13) 0 25%,
      transparent 47%
    ),
    linear-gradient(90deg, #ffffff 0%, #ffffff 41%, #eef6fd 100%);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 100vh;
    min-height: 100dvh;
    background:
      radial-gradient(
        circle at 72% 27%,
        rgba(44, 100, 156, 0.12) 0 18%,
        transparent 42%
      ),
      radial-gradient(
        circle at 18% 58%,
        rgba(2, 84, 160, 0.08) 0 20%,
        transparent 45%
      ),
      linear-gradient(180deg, #ffffff 0%, #eef6fd 100%);
  }
`;

export const HeroInner = styled.div`
  display: grid;
  grid-template-columns: minmax(620px, 1.15fr) minmax(420px, 0.85fr);
  grid-template-areas:
    "copy visual"
    "actions visual"
    "trust visual";
  align-items: center;
  width: min(100%, 1520px);
  min-height: calc(100vh - 82px);
  margin: 0 auto;
  padding: 54px 100px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(520px, 1.18fr) minmax(360px, 0.82fr);
    min-height: calc(100vh - 76px);
    padding: 44px 46px 36px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "copy"
      "visual"
      "actions"
      "trust";
    align-items: start;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 72px 24px 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 66px 20px 40px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 62px 18px 38px;
  }
`;

export const HeroCopy = styled.div`
  position: relative;
  z-index: 2;
  grid-area: copy;
  max-width: 920px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

export const HeroKicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 17px;
  margin-bottom: 22px;
  color: #53627b;
  font-size: 0.78rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  background: #eaf3fb;
  border-radius: ${({ theme }) => theme.radius.full};
  opacity: 0;
  animation:
    ${heroTextReveal} 780ms cubic-bezier(0.22, 1, 0.36, 1) 180ms forwards,
    ${gentleTextFloat} 5.6s ease-in-out 1.2s infinite;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 28px;
    padding: 0 14px;
    margin-bottom: 20px;
    color: #0254a0;
    font-size: 0.72rem;
    letter-spacing: 0.03em;
  }
`;

export const HeroKickerDot = styled.span`
  width: 6px;
  height: 6px;
  background: #0254a0;
  border-radius: 50%;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: #0d2244;
  font-size: 56px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.heading};
  opacity: 0;
  animation: ${heroTextReveal} 820ms cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  span {
    display: block;
    color: #0254a0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 48px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 360px;
    font-size: 1.62rem;
    line-height: 1.18;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 1.5rem;
  }
`;

export const HeroDescription = styled.p`
  width: min(100%, 760px);
  max-width: none;
  margin: 24px 0 30px;
  color: #526280;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.body};
  opacity: 0;
  animation: ${heroTextReveal} 860ms cubic-bezier(0.22, 1, 0.36, 1) 430ms forwards;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: min(100%, 680px);
    font-size: ${({ theme }) => theme.typography.size.base};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
    max-width: 360px;
    margin: 18px 0 0;
    color: #526280;
    font-size: 0.86rem;
    line-height: 1.55;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 0.8rem;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  grid-area: actions;
  margin-bottom: 38px;
  opacity: 0;
  animation: ${heroTextReveal} 860ms cubic-bezier(0.22, 1, 0.36, 1) 560ms forwards;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    gap: 12px;
    width: 100%;
    margin: 0 0 30px;
    justify-content: center;
  }
`;

export const HeroButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 0 0 auto;
  min-width: 200px;
  height: 44px;
  padding: 0 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  box-sizing: border-box;
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "#26395d")};
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  background: ${({ $variant }) =>
    $variant === "primary"
      ? "linear-gradient(135deg, #2c649c 0%, #0254a0 100%)"
      : "rgba(255, 255, 255, 0.82)"};
  border: ${({ $variant }) =>
    $variant === "primary" ? "0" : "1px solid rgba(44, 100, 156, 0.65)"};
  box-shadow: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.shadows.lg : "none"};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
  }

  svg {
    color: inherit;
    flex: 0 0 auto;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 12px;
    min-width: 176px;
    height: 42px;
    padding: 0 18px;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 50%;
    min-width: 0;
    height: 38px;
    font-size: 0.74rem;
    box-shadow: ${({ $variant, theme }) =>
      $variant === "primary" ? theme.shadows.md : "none"};
  }
`;

export const TrustStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 24px;
  grid-area: trust;
  align-items: center;
  opacity: 0;
  animation: ${heroTextReveal} 860ms cubic-bezier(0.22, 1, 0.36, 1) 700ms forwards;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
  }
`;

export const TrustItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 10px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    justify-items: center;
    gap: 8px;
    text-align: center;
  }
`;

export const TrustIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #0254a0;
  background: #eef6fd;
  border-radius: ${({ theme }) => theme.radius.md};
  flex: 0 0 auto;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 42px;
    height: 42px;
    border-radius: 50%;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const TrustText = styled.span`
  strong,
  small {
    display: block;
    color: #53627b;
    font-size: 0.78rem;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: 1.28;
  }

  small {
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    strong,
    small {
      color: #0d2244;
      font-size: 0.68rem;
      line-height: 1.18;
    }
  }
`;

export const HeroVisual = styled.div`
  position: relative;
  grid-area: visual;
  min-height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    min-height: 420px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    min-height: 270px;
    margin: 14px 0 12px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    min-height: 240px;
  }
`;

export const HeroVisualGlow = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  top: 50%;
  left: 50%;
  background: radial-gradient(
    circle,
    #eef6fd 0 38%,
    #ffffff14 39%,
    transparent 40%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 330px;
    height: 330px;
    opacity: 0.92;
  }
`;

export const HeroVisualStack = styled.div`
  position: relative;
  z-index: 1;
  width: 500px;
  height: 370px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 450px;
    height: 340px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(100%, 330px);
    height: 250px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: min(100%, 300px);
    height: 225px;
  }
`;

export const HeroImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: ${({ $size }) => $size?.width || "100%"};
  height: ${({ $size }) => $size?.height || "100%"};
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  filter: drop-shadow(0 16px 30px rgba(35, 67, 103, 0.18));
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: ${({ $index }) => $index + 1};
  animation: ${({ $index }) => ($index < 2 ? floatVertical : "none")}
    ${({ $index }) => ($index === 0 ? "4.8s" : "5.6s")} ease-in-out infinite;
`;
