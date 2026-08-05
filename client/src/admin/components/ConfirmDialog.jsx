import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 8000;
  background: rgba(11,31,60,0.45);
  display: flex; align-items: center; justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  padding: 16px;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 24px 80px rgba(11,31,60,0.22);
  animation: ${scaleIn} 0.25s cubic-bezier(0.22,1,0.36,1);
  font-family: Inter, sans-serif;

  h3 { margin: 0 0 10px; color: #0d2244; font-size: 1.1rem; }
  p { margin: 0 0 24px; color: #33425e; font-size: 0.875rem; line-height: 1.6; }
`;

const Actions = styled.div`display: flex; gap: 12px; justify-content: flex-end;`;

const Btn = styled.button`
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: Inter, sans-serif;
  cursor: pointer;
  border: 1px solid ${({ $danger }) => ($danger ? "#b42318" : "rgba(13,34,68,0.16)")};
  background: ${({ $danger }) => ($danger ? "#b42318" : "#fff")};
  color: ${({ $danger }) => ($danger ? "#fff" : "#0d2244")};
  transition: opacity 150ms;
  &:hover { opacity: 0.85; }
`;

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = "Delete", danger = true }) {
  return (
    <Overlay onClick={onCancel}>
      <Box onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <Actions>
          <Btn onClick={onCancel}>Cancel</Btn>
          <Btn $danger={danger} onClick={onConfirm}>{confirmLabel}</Btn>
        </Actions>
      </Box>
    </Overlay>
  );
}
