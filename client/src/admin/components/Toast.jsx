import { useState, useCallback, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

const slideIn = keyframes`from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}`;
const slideOut = keyframes`from{transform:translateX(0);opacity:1}to{transform:translateX(110%);opacity:0}`;

const Wrap = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  left: auto;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;

  @media (max-width: 480px) {
    top: 14px;
    right: 12px;
    left: 12px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  width: min(360px, calc(100vw - 48px));
  max-width: 360px;
  padding: 14px 18px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(11,31,60,0.18);
  border-left: 4px solid ${({ $type }) =>
    $type === "success" ? "#087443" : $type === "error" ? "#b42318" : "#0254a0"};
  pointer-events: all;
  animation: ${({ $exiting }) =>
    $exiting
      ? css`${slideOut} 0.3s ease forwards`
      : css`${slideIn} 0.3s cubic-bezier(0.22,1,0.36,1) forwards`};

  span { flex: 1; font-size: 0.875rem; color: #0d2244; font-family: Inter, sans-serif; line-height: 1.4; }
  button { background: none; border: none; cursor: pointer; color: #33425e; font-size: 16px; padding: 0; line-height: 1; }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
  }
`;

let _addToast = null;
export const toast = {
  success: (msg) => _addToast?.({ msg, type: "success" }),
  error: (msg) => _addToast?.({ msg, type: "error" }),
  info: (msg) => _addToast?.({ msg, type: "info" }),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, exiting: true } : x)));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 320);
  }, []);

  useEffect(() => {
    _addToast = ({ msg, type }) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, msg, type, exiting: false }]);
      timers.current[id] = setTimeout(() => remove(id), 4000);
    };
    return () => { _addToast = null; };
  }, [remove]);

  return (
    <Wrap>
      {toasts.map((t) => (
        <Item key={t.id} $type={t.type} $exiting={t.exiting}>
          <span>{t.msg}</span>
          <button onClick={() => remove(t.id)}>✕</button>
        </Item>
      ))}
    </Wrap>
  );
}
