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
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: Inter, sans-serif;
  background: ${({ $s }) => colors[$s]?.bg || "#f3f4f6"};
  color: ${({ $s }) => colors[$s]?.color || "#374151"};

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $s }) => colors[$s]?.dot || "#9ca3af"};
    flex-shrink: 0;
  }
`;

export default function StatusBadge({ status }) {
  return <Badge $s={status}>{status}</Badge>;
}
