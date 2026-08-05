import styled from "styled-components";

export const ContactPage = styled.section`
  padding: 0 100px 72px;
  background: #ffffff;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 46px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 18px 48px;
  }
`;

export const ContactHero = styled.div`
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
  min-height: 400px;
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
    min-height: 370px;
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
      ? "left: 70px; bottom: 86px;"
      : "right: 92px; top: 88px;"}
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
  max-width: 760px;
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

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px;
  width: min(100%, 1160px);
  margin: -64px auto 0;
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    margin-top: -40px;
  }
`;

export const ContactCard = styled.article`
  display: grid;
  justify-items: center;
  align-content: center;
  min-height: 220px;
  padding: 28px;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(13, 34, 68, 0.04);

  h2 {
    margin: 18px 0 18px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.lg};
    line-height: 1.2;
  }

  strong {
    color: #0254a0;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.35;
  }

  span {
    margin: 8px 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 118px;
    padding: 14px 16px;

    > span:first-child {
      width: 42px;
      height: 42px;

      svg {
        width: 17px;
        height: 17px;
      }
    }

    h2 {
      margin: 10px 0 7px;
      font-size: 0.82rem;
    }

    strong {
      max-width: 100%;
      font-size: 0.78rem;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    span {
      margin: 4px 0;
      font-size: 0.68rem;
    }
  }
`;

export const IconCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  color: #0254a0;
  background: #eaf3fb;
  border-radius: 50%;

  svg {
    width: 30px;
    height: 30px;
  }
`;

export const SectionHeader = styled.div`
  max-width: 620px;
  margin: 36px auto 28px;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #0d2244;
  font-size: 31px;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.18rem;
  }
`;

export const SectionIntro = styled.p`
  margin: 14px 0 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 10px;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

export const BranchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px;
  width: min(100%, 1080px);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
`;

export const BranchCard = styled.article`
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 24px;
  min-height: 300px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 14px;
    min-height: 0;
    padding: 18px;
  }

  ${IconCircle} {
    width: 64px;
    height: 64px;
    color: #ffffff;
    background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  }

  h2 {
    margin: 10px 0 18px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.2;
  }

  hr {
    margin: 22px 0 14px;
    border: 0;
    border-top: 1px solid rgba(13, 34, 68, 0.12);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${IconCircle} {
      width: 46px;
      height: 46px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    h2 {
      margin: 6px 0 12px;
      font-size: 1rem;
    }

    hr {
      margin: 14px 0 10px;
    }
  }
`;

export const InfoLine = styled.div`
  display: flex;
  gap: 12px;
  margin: 10px 0;
  color: #33425e;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.55;

  svg {
    margin-top: 4px;
    color: #0254a0;
    flex: 0 0 auto;
  }

  span span,
  small,
  strong {
    display: block;
  }

  small {
    color: #0d2244;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }

  strong {
    color: #0254a0;
    font-size: ${({ theme }) => theme.typography.size.base};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 9px;
    margin: 7px 0;
    font-size: 0.78rem;
    line-height: 1.4;

    svg {
      width: 12px;
      height: 12px;
      margin-top: 3px;
    }

    small {
      font-size: 0.72rem;
    }

    strong {
      font-size: 0.78rem;
      overflow-wrap: anywhere;
    }
  }
`;

export const MessageMapGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(420px, 0.92fr) minmax(520px, 1.08fr);
  gap: 34px;
  width: min(100%, 1260px);
  margin: 28px auto 0;
  padding: 34px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
    padding: 18px;
  }
`;

export const FormPanel = styled.div`
  h2,
  p {
    margin-left: 0;
  }

  h2 {
    margin: 0;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.2;

    &::after {
      display: block;
      width: 46px;
      height: 2px;
      margin-top: 14px;
      content: "";
      background: #0254a0;
    }
  }

  p {
    margin: 18px 0 14px;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.5;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      font-size: 1rem;

      &::after {
        width: 36px;
        margin-top: 10px;
      }
    }

    p {
      margin: 12px 0 10px;
      font-size: 0.78rem;
      line-height: 1.4;
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }

  input,
  textarea {
    width: 100%;
    min-height: 50px;
    padding: 0 16px;
    color: #26395d;
    font: inherit;
    background: #ffffff;
    border: 1px solid rgba(13, 34, 68, 0.16);
    border-radius: 6px;
    outline: none;
  }

  input:nth-child(n + 3),
  textarea {
    grid-column: 1 / -1;
  }

  textarea {
    padding-top: 14px;
    resize: vertical;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 10px;

    input,
    textarea {
      min-height: 42px;
      padding: 0 12px;
      font-size: 0.8rem;
    }

    textarea {
      padding-top: 12px;
    }
  }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 0 0 auto;
  min-width: 200px;
  height: 44px;
  margin-top: 22px;
  padding: 0 24px;
  color: #ffffff;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
  white-space: nowrap;
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  border: 0;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.68;
  }

  svg {
    flex: 0 0 auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    min-width: 176px;
    height: 42px;
    padding: 0 18px;
    font-size: ${({ theme }) => theme.typography.size.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 9px;
    min-width: 0;
    height: 42px;
    padding: 0 16px;
    font-size: 0.82rem;
  }
`;

export const FormStatus = styled.p`
  margin: 14px 0 0;
  color: ${({ $type }) => ($type === "success" ? "#087443" : "#b42318")};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.45;
`;

export const MapPanel = styled.div`
  h2 {
    margin: 0;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.xl};
    line-height: 1.2;

    &::after {
      display: block;
      width: 46px;
      height: 2px;
      margin-top: 14px;
      content: "";
      background: #0254a0;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      font-size: 1rem;

      &::after {
        width: 36px;
        margin-top: 10px;
      }
    }
  }
`;

export const MapCard = styled.div`
  position: relative;
  min-height: 430px;
  margin-top: 20px;
  overflow: hidden;
  background: #f6fbff;
  border-radius: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 260px;
  }
`;

export const MapFrame = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  filter: saturate(0.72) contrast(0.95) brightness(1.04);
`;

export const MapLocation = styled.article`
  position: absolute;
  z-index: 1;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 18px;
  width: 280px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(13, 34, 68, 0.12);
  transform: translate(-50%, -50%);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  &::after {
    position: absolute;
    left: 18px;
    bottom: -10px;
    width: 20px;
    height: 20px;
    content: "";
    background: rgba(255, 255, 255, 0.96);
    transform: rotate(45deg);
    box-shadow: 8px 8px 18px rgba(13, 34, 68, 0.08);
  }

  > svg {
    position: relative;
    z-index: 1;
    width: 28px;
    height: 28px;
    color: #0254a0;
  }

  > div {
    position: relative;
    z-index: 1;
  }

  h3 {
    margin: 0 0 8px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.base};
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.45;
  }
`;

export const HelpBand = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: min(100%, 1260px);
  min-height: 150px;
  margin: 0 auto;
  padding: 28px 42px;
  background: #f6fbff;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    padding: 10px 14px;
  }
`;

export const HelpItem = styled.div`
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  align-items: center;
  gap: 28px;

  & + & {
    padding-left: 80px;
    border-left: 1px solid rgba(13, 34, 68, 0.16);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px;
    padding: 12px 0;

    & + & {
      padding-left: 0;
      border-left: 0;
      border-top: 1px solid rgba(13, 34, 68, 0.12);
    }
  }

  ${IconCircle} {
    color: #ffffff;
    background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      width: 42px;
      height: 42px;

      svg {
        width: 17px;
        height: 17px;
      }
    }
  }

  h2 {
    margin: 0 0 10px;
    color: #0d2244;
    font-size: ${({ theme }) => theme.typography.size.lg};
    line-height: 1.2;
  }

  p {
    margin: 0 0 4px;
    color: #33425e;
    font-size: ${({ theme }) => theme.typography.size.sm};
    line-height: 1.45;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h2 {
      margin-bottom: 6px;
      font-size: 0.82rem;
    }

    p {
      margin-bottom: 2px;
      font-size: 0.7rem;
      line-height: 1.35;
    }
  }
`;
