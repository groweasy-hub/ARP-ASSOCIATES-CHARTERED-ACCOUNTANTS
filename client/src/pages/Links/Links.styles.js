import styled from "styled-components";

export const LinksPage = styled.section`
  padding: 0 100px 72px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 18px 48px;
  }
`;

export const LinksHero = styled.div`
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
  min-height: 380px;
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
    min-height: 350px;
    margin-left: -46px;
    margin-right: -46px;
    padding: 44px 86px 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 300px;
    margin-left: -18px;
    margin-right: -18px;
    padding: 42px 24px 38px;
  }
`;

export const DottedDecor = styled.span`
  position: absolute;
  ${({ $position }) =>
    $position === "left"
      ? "left: 70px; bottom: 72px;"
      : "right: 92px; top: 84px;"}
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
  gap: 18px;
  max-width: 820px;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: #0d2244;
  font-size: 50px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.08;

  &::after {
    display: block;
    width: 56px;
    height: 3px;
    margin: 26px auto 0;
    content: "";
    background: #0254a0;
    border-radius: ${({ theme }) => theme.radius.full};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 42px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.62rem;

    &::after {
      width: 42px;
      margin-top: 18px;
    }
  }
`;

export const HeroDescription = styled.p`
  max-width: 620px;
  margin: 0;
  color: #26395d;
  font-size: ${({ theme }) => theme.typography.size.base};
  line-height: 1.55;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.86rem;
    line-height: 1.45;
  }
`;

export const LinkTableCard = styled.section`
  width: min(100%, 1280px);
  margin: 44px auto 0;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(2, 84, 160, 0.28);
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(13, 34, 68, 0.04);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 32px;
    overflow: hidden;
  }
`;

export const LinkTableHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 98px;
  padding: 22px 28px;
  background: #f6fbff;
  border-bottom: 1px solid rgba(13, 34, 68, 0.12);

  h2 {
    margin: 0;
    color: #0d2244;
    font-size: 28px;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: 1.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 12px;
    min-height: 68px;
    padding: 14px 16px;

    h2 {
      font-size: 0.82rem;
    }
  }
`;

export const TableIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  color: #ffffff;
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  border-radius: 50%;
  flex: 0 0 auto;

  svg {
    width: 27px;
    height: 27px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 42px;
    height: 42px;

    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

export const LinkTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    min-width: 0;
  }

  th,
  td {
    padding: 14px 24px;
    border-bottom: 1px dashed rgba(13, 34, 68, 0.14);
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: #0254a0;
    font-size: ${({ theme }) => theme.typography.size.base};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: 1.2;
  }

  td {
    color: #26395d;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.4;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 72px;
    color: #0254a0;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    text-align: center;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 40%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 52px;
    padding-left: 8px;
    padding-right: 24px;
    text-align: center;
  }

  a {
    color: #15467c;
    text-decoration: none;
    word-break: break-word;
  }

  td:nth-child(4) a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #0254a0;
  }

  td:nth-child(4) svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    thead {
      display: none;
    }

    tbody {
      display: block;
    }

    tr {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 38px;
      align-items: center;
      column-gap: 12px;
      padding: 13px 16px;
      border-bottom: 1px solid rgba(13, 34, 68, 0.1);
    }

    tr:last-child {
      border-bottom: 0;
    }

    th,
    td {
      display: block;
      padding: 0;
      border-bottom: 0;
    }

    td:nth-child(1) {
      display: none;
    }

    td:nth-child(2) {
      width: auto;
      grid-column: 1;
      grid-row: 1;
      color: #0d2244;
      font-size: 0.78rem;
      font-weight: ${({ theme }) => theme.typography.weight.bold};
      line-height: 1.25;
    }

    td:nth-child(3) {
      grid-column: 1;
      grid-row: 2;
      margin-top: 5px;
      font-size: 0.5rem;
      line-height: 1.25;
    }

    td:nth-child(3) a {
      color: #45627f;
      word-break: break-all;
    }

    td:nth-child(4) {
      width: 38px;
      grid-column: 2;
      grid-row: 1 / span 2;
      padding: 0;
      text-align: center;
      align-self: center;
    }

    td:nth-child(4) a {
      width: 30px;
      height: 30px;
      background: #eaf3fb;
      border-radius: 50%;
    }

    td:nth-child(4) svg {
      width: 12px;
      height: 12px;
    }
  }
`;
