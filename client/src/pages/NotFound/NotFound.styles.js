import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const fadeUp = keyframes`from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}`;

export const NotFoundPage = styled.section`
  min-height: ${({ $admin }) => ($admin ? "calc(100vh - 120px)" : "calc(100vh - 76px)")};
  display: grid;
  place-items: center;
  padding: ${({ $admin }) => ($admin ? "32px 18px" : "96px 18px 48px")};
  background:
    radial-gradient(circle at 18% 16%, rgba(2, 84, 160, 0.1), transparent 28%),
    linear-gradient(180deg, #f6fbff 0%, #ffffff 100%);

  @media (max-width: 768px) {
    min-height: ${({ $admin }) => ($admin ? "calc(100vh - 210px)" : "calc(100vh - 70px)")};
    padding: ${({ $admin }) => ($admin ? "20px 10px 96px" : "86px 14px 36px")};
  }
`;

export const NotFoundCard = styled.div`
  width: min(100%, 640px);
  display: grid;
  justify-items: center;
  gap: 16px;
  padding: 36px 28px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(13, 34, 68, 0.08);
  box-shadow: 0 24px 70px rgba(11, 31, 60, 0.1);
  text-align: center;
  animation: ${fadeUp} 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) {
    gap: 13px;
    padding: 28px 18px;
    border-radius: 16px;
  }
`;

export const Code = styled.div`
  color: #0254a0;
  font-size: clamp(3.8rem, 13vw, 7rem);
  line-height: 0.9;
  font-weight: 800;
  letter-spacing: 0;
`;

export const Title = styled.h1`
  margin: 0;
  color: #071e49;
  font-size: clamp(1.35rem, 4vw, 2rem);
  line-height: 1.15;
  font-weight: 800;
`;

export const Text = styled.p`
  max-width: 460px;
  margin: 0;
  color: #4b5b7b;
  font-size: 0.92rem;
  line-height: 1.65;

  @media (max-width: 768px) {
    font-size: 0.82rem;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;

  @media (max-width: 480px) {
    width: 100%;
    display: grid;
  }
`;

export const PrimaryLink = styled(Link)`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2c649c, #0254a0);
  color: #ffffff;
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 800;
`;

export const SecondaryLink = styled(Link)`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 9px;
  background: #ffffff;
  color: #071e49;
  border: 1px solid rgba(13, 34, 68, 0.14);
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 800;
`;
