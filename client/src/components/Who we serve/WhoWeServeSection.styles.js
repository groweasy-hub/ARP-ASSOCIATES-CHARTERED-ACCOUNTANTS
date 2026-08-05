import styled from "styled-components";

export const ServeSection = styled.section`
  padding: 25px 80px 62px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-left: 46px;
    padding-right: 46px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 46px 0 56px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 42px 0 52px;
  }
`;

export const ServeTitle = styled.h2`
  margin: 0;
  color: #4d5870;
  font-size: ${({ theme }) => theme.typography.size.h4};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: 1.2;
  text-align: center;

  strong {
    color: #0d2244;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.18rem;
  }
`;

export const ServeDivider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 360px;
  height: 18px;
  margin: 0 auto 38px;

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
    background: #526280;
  }

  span:nth-child(3) {
    background: #2c649c;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 160px;
    height: 20px;
    margin-bottom: 34px;
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

export const ServeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, max-content);
  justify-content: center;
  gap: 126px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 58px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: center;
    width: min(calc(100% - 36px), 340px);
    margin: 0 auto;
    gap: 20px 14px;
  }
`;

export const ServeItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 24px;
  color: #42516e;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    justify-items: center;
    gap: 10px;
    color: #0d2244;
    font-size: 0.78rem;
    line-height: 1.2;
    text-align: center;
    white-space: normal;
  }
`;

export const ServeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  color: #0254a0;
  background: #eef6fd;
  border-radius: 50%;

  svg {
    width: 34px;
    height: 34px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 58px;
    height: 58px;

    svg {
      width: 26px;
      height: 26px;
    }
  }
`;
