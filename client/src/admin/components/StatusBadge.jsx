import styled from "styled-components";

const colors = {
  New: { bg: "#eaf3fb", color: "#0254a0", dot: "#0254a0" },
  Contacted: { bg: "#ecfdf3", color: "#087443", dot: "#087443" },
  "Follow Up": { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" },
  Closed: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" },
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 0.66rem;
  font-weight: 600;
  font-family: Inter, sans-serif;
  background: ${({ $s }) => colors[$s]?.bg || "#f3f4f6"};
  color: ${({ $s }) => colors[$s]?.color || "#374151"};

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ $s }) => colors[$s]?.dot || "#9ca3af"};
    flex-shrink: 0;
  }
`;

export default function StatusBadge({ status }) {
  return <Badge $s={status}>{status}</Badge>;
}
