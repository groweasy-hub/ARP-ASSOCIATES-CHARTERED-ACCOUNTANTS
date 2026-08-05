import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 0 0;
  font-family: Inter, sans-serif;
  font-size: 0.875rem;
  color: #33425e;
  flex-wrap: wrap;
`;

const Buttons = styled.div`display: flex; gap: 6px;`;

const Btn = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? "#0254a0" : "rgba(13,34,68,0.16)")};
  background: ${({ $active }) => ($active ? "#0254a0" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#0d2244")};
  font-size: 0.875rem;
  font-family: Inter, sans-serif;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  transition: all 150ms;
  &:hover:not(:disabled):not([data-active="true"]) { background: #f6fbff; }
`;

export default function Pagination({ page, pages, total, limit, onPage }) {
  if (pages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pageNums = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) pageNums.push(i);

  return (
    <Wrap>
      <span>Showing {from}–{to} of {total} results</span>
      <Buttons>
        <Btn disabled={page === 1} onClick={() => onPage(page - 1)}>‹ Prev</Btn>
        {pageNums.map((n) => (
          <Btn key={n} $active={n === page} data-active={n === page} onClick={() => onPage(n)}>{n}</Btn>
        ))}
        <Btn disabled={page === pages} onClick={() => onPage(page + 1)}>Next ›</Btn>
      </Buttons>
    </Wrap>
  );
}
