import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const ServicesSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 52px 100px 72px;
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
      radial-gradient(circle at 8% 6%, rgba(2, 84, 160, 0.07) 0 18%, transparent 42%),
      #ffffff;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 44px 0 54px;
  }
`;

export const SectionDecor = styled.div`
  position: absolute;
  top: 88px;
  left: 18px;
  width: 72px;
  height: 112px;
  opacity: 0.2;
  background-image: radial-gradient(circle, #0254a0 2px, transparent 2.5px);
  background-size: 28px 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const SectionHeader = styled.div`
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto 42px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 340px;
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

export const ServicesGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: min(100%, 1420px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 18px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    width: min(calc(100% - 36px), 380px);
  }
`;

export const ServicesCard = styled(NavLink)`
  position: relative;
  display: grid;
  grid-template-columns: 92px 1px minmax(0, 1fr);
  min-height: 218px;
  padding: 30px 26px 28px 24px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(13, 34, 68, 0.06);
  box-sizing: border-box;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: rgba(2, 84, 160, 0.22);
    box-shadow: 0 16px 34px rgba(13, 34, 68, 0.1);
    transform: translateY(-3px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 58px minmax(0, 1fr);
    align-items: center;
    min-height: 104px;
    padding: 18px 14px;
    border-radius: 10px;
    box-shadow: 0 10px 22px rgba(13, 34, 68, 0.05);
  }
`;

export const CardIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  color: #0254a0;
  background: #eef6fd;
  border-radius: 50%;

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 48px;
    height: 48px;

    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

export const CardDivider = styled.div`
  width: 1px;
  min-height: 146px;
  background: rgba(13, 34, 68, 0.12);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const CardContent = styled.div`
  padding-left: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 8px;
  }
`;

export const CardTitle = styled.h3`
  margin: 4px 0 14px;
  color: #0d2244;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: 1.2;

  &::after {
    display: block;
    width: 42px;
    height: 2px;
    margin-top: 14px;
    content: "";
    background: #0254a0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 0 7px;
    font-size: 0.82rem;

    &::after {
      display: none;
    }
  }
`;

export const CardText = styled.p`
  margin: 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: 1.65;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.7rem;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

export const CardArrow = styled.span`
  position: absolute;
  right: 22px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #0254a0;
  background: #eef6fd;
  border-radius: 50%;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  ${ServicesCard}:hover & {
    color: #ffffff;
    background: #0254a0;
  }

  svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
