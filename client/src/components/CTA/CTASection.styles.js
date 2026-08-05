import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const CTASectionWrapper = styled.section`
  padding: 0;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 46px 0 50px;
  }
`;

export const CTAShell = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1.12fr) minmax(260px, 0.8fr) minmax(
      220px,
      0.56fr
    );
  align-items: center;
  gap: 30px;
  width: 100%;
  min-height: 150px;
  margin: 0 auto;
  padding: 18px 100px;
  background: #ffffff;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(300px, 1fr) minmax(230px, 0.75fr) minmax(
        190px,
        0.58fr
      );
    gap: 22px;
    padding: 18px 46px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr) minmax(230px, 0.55fr);
    gap: 24px;
    padding: 22px 46px;

    > *:nth-child(2) {
      grid-column: 1 / -1;
      grid-row: 2;
      width: 100%;
      min-height: 86px;
      padding: 0;
      border-left: 0;
      border-right: 0;
      border-top: 1px solid rgba(13, 34, 68, 0.08);
      padding-top: 18px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 30px;
    width: min(calc(100% - 36px), 360px);
    min-height: 0;
    padding: 0;
  }
`;

export const CTAIntro = styled.div`
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr);
  align-items: center;
  gap: 22px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 50px minmax(0, 1fr);
    gap: 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 18px;
    text-align: center;
  }
`;

export const CTAIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 25px;
    height: 25px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 48px;
    height: 48px;

    svg {
      width: 21px;
      height: 21px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 58px;
    height: 58px;

    svg {
      width: 27px;
      height: 27px;
    }
  }
`;

export const CTAContent = styled.div`
  min-width: 0;
`;

export const CTATitle = styled.h2`
  max-width: 460px;
  margin: 0;
  color: #0d2244;
  font-size: 24px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.22;

  strong {
    color: #0254a0;
    font-weight: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 390px;
    font-size: 20px;
    line-height: 1.22;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 420px;
    font-size: 19px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 310px;
    font-size: 1.18rem;
    line-height: 1.3;
  }
`;

export const CTASubtitle = styled.p`
  max-width: 460px;
  margin: 10px 0 0;
  color: #33425e;
  font-size: 0.88rem;
  line-height: 1.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 380px;
    font-size: 0.8rem;
    line-height: 1.42;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 270px;
    margin: 16px auto 0;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

export const CTAFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(86px, 1fr));
  align-items: center;
  min-height: 100px;
  padding: 0 18px;
  border-left: 1px solid rgba(13, 34, 68, 0.1);
  border-right: 1px solid rgba(13, 34, 68, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
    justify-self: stretch;
    min-height: 0;
    padding: 0;
    border: 0;
  }
`;

export const CTAFeature = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  color: #0d2244;
  font-size: 0.78rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.2;
  text-align: center;

  & + & {
    border-left: 1px solid rgba(13, 34, 68, 0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 44px minmax(0, 1fr);
    align-items: center;
    justify-items: start;
    gap: 16px;
    font-size: 0.78rem;
    text-align: left;

    & + & {
      border-left: 0;
    }
  }
`;

export const CTAFeatureIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 42px;
    height: 42px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const CTAActions = styled.div`
  display: grid;
  gap: 12px;
  min-width: 0;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    gap: 12px;
  }
`;

export const CTAButton = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 0 16px;
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "#0254a0")};
  font-size: 0.82rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  background: ${({ $variant }) =>
    $variant === "primary"
      ? "linear-gradient(135deg, #2c649c 0%, #0254a0 100%)"
      : "rgba(255, 255, 255, 0.88)"};
  border: 1px solid
    ${({ $variant }) => ($variant === "primary" ? "transparent" : "#0254a0")};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.shadows.lg : "none"};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  svg {
    flex: 0 0 auto;
    width: ${({ theme }) => theme.typography.size.sm};
    height: ${({ theme }) => theme.typography.size.sm};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $variant }) =>
      $variant === "primary"
        ? "0 18px 34px rgba(2, 84, 160, 0.26)"
        : "0 10px 22px rgba(2, 84, 160, 0.1)"};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 8px;
    height: 38px;
    padding: 0 12px;
    font-size: 0.76rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 12px;
    min-width: 0;
    height: 48px;
    padding: 0 18px;
    font-size: 0.82rem;
    box-shadow: ${({ $variant, theme }) =>
      $variant === "primary" ? theme.shadows.md : "none"};
  }
`;
