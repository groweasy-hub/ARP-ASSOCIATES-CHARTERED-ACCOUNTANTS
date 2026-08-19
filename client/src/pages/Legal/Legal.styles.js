import styled from "styled-components";

export const LegalPage = styled.main`
  background: #ffffff;
`;

export const LegalHero = styled.section`
  padding: 132px 24px 52px;
  background:
    radial-gradient(circle at 12% 18%, rgba(2, 84, 160, 0.1), transparent 30%),
    linear-gradient(180deg, #f6fbff 0%, #ffffff 100%);
  text-align: center;

  h1 {
    margin: 0;
    color: #071e49;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: 0;
  }

  p {
    max-width: 720px;
    margin: 16px auto 0;
    color: #526280;
    font-size: clamp(0.92rem, 1.5vw, 1.08rem);
    line-height: 1.7;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 104px 18px 34px;
  }
`;

export const LegalContent = styled.article`
  width: min(100% - 36px, 980px);
  margin: 0 auto;
  padding: 44px 0 72px;
  color: #26395d;

  section + section {
    margin-top: 28px;
    padding-top: 26px;
    border-top: 1px solid rgba(13, 34, 68, 0.08);
  }

  h2 {
    margin: 0 0 10px;
    color: #0d2244;
    font-size: 1.08rem;
    line-height: 1.3;
    font-weight: 800;
  }

  p,
  li {
    color: #33425e;
    font-size: 0.94rem;
    line-height: 1.78;
  }

  p {
    margin: 0;
  }

  ul {
    margin: 10px 0 0;
    padding-left: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(100% - 28px, 720px);
    padding: 30px 0 50px;

    section + section {
      margin-top: 22px;
      padding-top: 22px;
    }

    h2 {
      font-size: 0.98rem;
    }

    p,
    li {
      font-size: 0.82rem;
      line-height: 1.7;
    }
  }
`;
