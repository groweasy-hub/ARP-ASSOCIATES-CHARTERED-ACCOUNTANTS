import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`min-height:calc(100vh - 120px);display:flex;align-items:center;justify-content:center`;
const Card = styled.div`width:100%;max-width:440px;text-align:center;background:#fff;border-radius:14px;border:1px solid rgba(13,34,68,.07);box-shadow:0 2px 12px rgba(11,31,60,.07);padding:34px;h2{margin:0 0 8px;color:#0d2244}p{margin:0 0 22px;color:#33425e;line-height:1.6}button{height:42px;padding:0 18px;border:0;border-radius:8px;background:linear-gradient(135deg,#2c649c,#0254a0);color:#fff;font:inherit;font-weight:700;cursor:pointer}`;

export default function Unauthorized() {
  const navigate = useNavigate();
  return <Wrap><Card><h2>Access Restricted</h2><p>You don't have permission to access this page.</p><button onClick={() => navigate(-1)}>Go Back</button></Card></Wrap>;
}
