import { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import api from "../api";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../components/Toast";

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const PageHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin-bottom: 22px;
  h2 { margin: 0; color: #0d2244; font-size: 1.25rem; font-weight: 700; }
`;

const TableWrap = styled.div`
  background: #fff; border-radius: 14px;
  box-shadow: 0 2px 12px rgba(11,31,60,0.07);
  border: 1px solid rgba(13,34,68,0.07); overflow: hidden;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.875rem;
  th { padding: 13px 16px; text-align: left; color: #33425e; font-weight: 600; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; background: #f6fbff; border-bottom: 1px solid rgba(13,34,68,0.08); white-space: nowrap; }
  td { padding: 13px 16px; color: #0d2244; border-bottom: 1px solid rgba(13,34,68,0.06); vertical-align: middle; }
  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: #f9fbff; }
  tr[data-unread="true"] td { background: #f6fbff; }
`;

const ActionBtn = styled.button`
  padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600;
  font-family: inherit; cursor: pointer; border: 1px solid;
  transition: all 150ms;
  ${({ $variant }) =>
    $variant === "danger"
      ? "border-color:#b42318;color:#b42318;background:#fff;&:hover{background:#b42318;color:#fff;}"
      : "border-color:rgba(13,34,68,0.2);color:#0d2244;background:#fff;&:hover{background:#f6fbff;}"}
`;

const Actions = styled.div`display: flex; gap: 6px; flex-wrap: wrap;`;

const UnreadDot = styled.span`
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: #0254a0; margin-right: 6px; flex-shrink: 0;
`;

const Skeleton = styled.div`
  height: 16px; width: ${({ $w }) => $w || "100%"};
  background: linear-gradient(90deg,#f0f4f8 25%,#e8eef5 50%,#f0f4f8 75%);
  background-size: 200% 100%; border-radius: 6px;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
`;

const Empty = styled.div`
  text-align: center; padding: 56px 24px; color: #33425e;
  svg { width: 48px; height: 48px; color: #c5d4e8; margin-bottom: 14px; }
  p { margin: 0; font-size: 0.9rem; }
`;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; z-index: 8000;
  background: rgba(11,31,60,0.45);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: #fff; border-radius: 16px; width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 80px rgba(11,31,60,0.22);
  animation: ${fadeIn} 0.25s cubic-bezier(0.22,1,0.36,1);
`;

const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 28px; border-bottom: 1px solid rgba(13,34,68,0.1);
  h3 { margin: 0; color: #0d2244; font-size: 1.05rem; font-weight: 700; }
  button { background: none; border: none; cursor: pointer; color: #33425e; font-size: 20px; line-height: 1; padding: 0; }
`;

const ModalBody = styled.div`padding: 24px 28px;`;

const DetailRow = styled.div`
  display: grid; grid-template-columns: 110px 1fr; gap: 8px;
  padding: 10px 0; border-bottom: 1px solid rgba(13,34,68,0.07);
  font-size: 0.875rem;
  &:last-child { border-bottom: 0; }
  label { color: #33425e; font-weight: 600; }
  span { color: #0d2244; line-height: 1.6; word-break: break-word; }
`;

export default function Messages() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await api.get(`/leads?page=${page}&limit=10&sort=newest`);
    if (res.success) { setLeads(res.leads); setTotal(res.total); setPages(res.pages); }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const openModal = async (lead) => {
    setSelected(lead);
    if (!lead.isRead) {
      await api.patch(`/leads/${lead._id}`, { isRead: true });
      setLeads((prev) => prev.map((l) => l._id === lead._id ? { ...l, isRead: true } : l));
    }
  };

  const toggleRead = async (lead) => {
    const res = await api.patch(`/leads/${lead._id}`, { isRead: !lead.isRead });
    if (res.success) {
      toast.success(lead.isRead ? "Marked as unread" : "Marked as read");
      setLeads((prev) => prev.map((l) => l._id === lead._id ? { ...l, isRead: !l.isRead } : l));
    }
  };

  const handleDelete = async () => {
    const res = await api.delete(`/leads/${deleteId}`);
    setDeleteId(null);
    if (res.success) { toast.success("Message deleted"); fetchLeads(); }
    else toast.error("Delete failed");
  };

  return (
    <div>
      <PageHeader>
        <h2>Contact Messages</h2>
      </PageHeader>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Subject</th>
              <th>Message</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((__, j) => <td key={j}><Skeleton /></td>)}</tr>
                ))
              : leads.length === 0
              ? <tr><td colSpan={7}><Empty><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>No messages yet</p></Empty></td></tr>
              : leads.map((l) => (
                  <tr key={l._id} data-unread={!l.isRead}>
                    <td style={{ fontWeight: 600 }}>
                      {!l.isRead && <UnreadDot />}{l.name}
                    </td>
                    <td style={{ color: "#0254a0" }}>{l.email}</td>
                    <td>{l.phone}</td>
                    <td>{l.subject}</td>
                    <td style={{ color: "#33425e", maxWidth: 200 }}>{l.message.slice(0, 60)}{l.message.length > 60 ? "…" : ""}</td>
                    <td style={{ color: "#33425e", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {new Date(l.createdAt).toLocaleDateString("en-IN")}<br />
                      <span style={{ fontSize: "0.72rem" }}>{new Date(l.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                    <td>
                      <Actions>
                        <ActionBtn onClick={() => openModal(l)}>View</ActionBtn>
                        <ActionBtn onClick={() => toggleRead(l)}>{l.isRead ? "Unread" : "Read"}</ActionBtn>
                        <ActionBtn $variant="danger" onClick={() => setDeleteId(l._id)}>Delete</ActionBtn>
                      </Actions>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
        <div style={{ padding: "0 16px 16px" }}>
          <Pagination page={page} pages={pages} total={total} limit={10} onPage={setPage} />
        </div>
      </TableWrap>

      {selected && (
        <ModalOverlay onClick={() => setSelected(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Message Details</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </ModalHeader>
            <ModalBody>
              {[
                ["Name", selected.name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Subject", selected.subject],
                ["Message", selected.message],
                ["Date", new Date(selected.createdAt).toLocaleString("en-IN")],
                ["Status", selected.isRead ? "Read" : "Unread"],
              ].map(([label, val]) => (
                <DetailRow key={label}><label>{label}</label><span>{val}</span></DetailRow>
              ))}
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Message"
          message="Are you sure you want to permanently delete this message?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
