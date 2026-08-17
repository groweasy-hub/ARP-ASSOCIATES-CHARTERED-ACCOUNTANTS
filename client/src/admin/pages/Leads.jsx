import { useEffect, useState, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import api from "../api";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../components/Toast";

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const PageHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; margin-bottom: 16px;
  h2 { margin: 0; color: #0d2244; font-size: 1.08rem; font-weight: 700; }
`;

const ExportBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 7px;
  background: linear-gradient(135deg,#2c649c,#0254a0);
  color: #fff; border: none; font-size: 0.78rem; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: opacity 150ms;
  &:hover { opacity: 0.88; }
  svg { width: 14px; height: 14px; }
`;

const Toolbar = styled.div`
  display: flex; gap: 9px; flex-wrap: wrap; margin-bottom: 12px;
`;

const SearchInput = styled.input`
  flex: 1; min-width: 180px; height: 36px; padding: 0 11px;
  border: 1.5px solid rgba(13,34,68,0.16); border-radius: 7px;
  font: inherit; font-size: 0.78rem; color: #26395d; background: #fff; outline: none;
  &:focus { border-color: #0254a0; }
`;

const Select = styled.select`
  height: 36px; padding: 0 10px; border-radius: 7px;
  border: 1.5px solid rgba(13,34,68,0.16); background: #fff;
  font: inherit; font-size: 0.78rem; color: #26395d; outline: none; cursor: pointer;
  &:focus { border-color: #0254a0; }
`;

const TableWrap = styled.div`
  background: #fff; border-radius: 10px;
  box-shadow: 0 2px 10px rgba(11,31,60,0.06);
  border: 1px solid rgba(13,34,68,0.07); overflow: hidden;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.78rem;
  th { padding: 9px 11px; text-align: left; color: #33425e; font-weight: 600; font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.04em; background: #f6fbff; border-bottom: 1px solid rgba(13,34,68,0.08); white-space: nowrap; }
  td { padding: 9px 11px; color: #0d2244; border-bottom: 1px solid rgba(13,34,68,0.06); vertical-align: middle; }
  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: #f9fbff; }
`;

const ActionBtn = styled.button`
  padding: 5px 9px; border-radius: 6px; font-size: 0.7rem; font-weight: 600;
  font-family: inherit; cursor: pointer; border: 1px solid;
  transition: all 150ms;
  ${({ $variant }) =>
    $variant === "danger"
      ? "border-color:#b42318;color:#b42318;background:#fff;&:hover{background:#b42318;color:#fff;}"
      : "border-color:rgba(13,34,68,0.2);color:#0d2244;background:#fff;&:hover{background:#f6fbff;}"}
`;

const Actions = styled.div`display: flex; gap: 6px; flex-wrap: wrap;`;

const Skeleton = styled.div`
  height: ${({ $h }) => $h || "16px"}; width: ${({ $w }) => $w || "100%"};
  background: linear-gradient(90deg,#f0f4f8 25%,#e8eef5 50%,#f0f4f8 75%);
  background-size: 200% 100%; border-radius: 6px;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
`;

const Empty = styled.div`
  text-align: center; padding: 38px 18px; color: #33425e;
  svg { width: 38px; height: 38px; color: #c5d4e8; margin-bottom: 10px; }
  p { margin: 0; font-size: 0.8rem; }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed; inset: 0; z-index: 8000;
  background: rgba(11,31,60,0.45);
  display: flex; align-items: center; justify-content: center;
  padding: 12px;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: #fff; border-radius: 12px; width: 100%; max-width: 540px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 80px rgba(11,31,60,0.22);
  animation: ${fadeIn} 0.25s cubic-bezier(0.22,1,0.36,1);
`;

const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid rgba(13,34,68,0.1);
  h3 { margin: 0; color: #0d2244; font-size: 0.95rem; font-weight: 700; }
  button { background: none; border: none; cursor: pointer; color: #33425e; font-size: 18px; line-height: 1; padding: 0; }
`;

const ModalBody = styled.div`padding: 18px 20px;`;

const DetailRow = styled.div`
  display: grid; grid-template-columns: 130px 1fr; gap: 8px;
  padding: 8px 0; border-bottom: 1px solid rgba(13,34,68,0.07);
  font-size: 0.78rem;
  &:last-child { border-bottom: 0; }
  label { color: #33425e; font-weight: 600; }
  span { color: #0d2244; line-height: 1.55; word-break: break-word; }
`;

const ModalField = styled.div`
  margin-top: 14px;
  label { display: block; margin-bottom: 6px; color: #0d2244; font-size: 0.78rem; font-weight: 600; }
`;

const ModalSelect = styled.select`
  width: 100%; height: 38px; padding: 0 10px; border-radius: 7px;
  border: 1.5px solid rgba(13,34,68,0.16); background: #fff;
  font: inherit; font-size: 0.78rem; color: #26395d; outline: none;
  &:focus { border-color: #0254a0; }
`;

const ModalTextarea = styled.textarea`
  width: 100%; padding: 10px 12px; border-radius: 7px;
  border: 1.5px solid rgba(13,34,68,0.16); background: #fff;
  font: inherit; font-size: 0.78rem; color: #26395d; outline: none;
  resize: vertical; box-sizing: border-box;
  &:focus { border-color: #0254a0; }
`;

const SaveBtn = styled.button`
  margin-top: 14px; padding: 8px 18px; border-radius: 7px;
  background: linear-gradient(135deg,#2c649c,#0254a0); color: #fff;
  border: none; font-size: 0.78rem; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: opacity 150ms;
  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const DesktopLeads = styled.div`
  @media (max-width: 760px) {
    display: none;
  }
`;

const MobileLeads = styled.div`
  display: none;

  @media (max-width: 760px) {
    display: grid;
    gap: 14px;
  }
`;

const MobileTitle = styled.h2`
  margin: 0 0 2px;
  color: #071e49;
  font-size: 1.18rem;
  font-weight: 800;
`;

const MobileSearch = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    width: 18px;
    height: 18px;
    transform: translateY(-50%);
    color: #64748b;
  }

  input {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    border: 1px solid rgba(13,34,68,0.12);
    border-radius: 10px;
    padding: 0 14px 0 44px;
    background: #ffffff;
    color: #071e49;
    font: inherit;
    font-size: 0.78rem;
    outline: none;
    box-shadow: 0 8px 20px rgba(11,31,60,0.04);
  }
`;

const MobileFilterRow = styled.div`
  display: grid;
  grid-template-columns: 0.78fr 0.9fr 1.05fr 0.95fr;
  gap: 5px;

  select {
    width: 100%;
    height: 36px;
    border: 1px solid rgba(13,34,68,0.12);
    border-radius: 8px;
    padding: 0 4px;
    background: #ffffff;
    color: #071e49;
    font: inherit;
    font-size: 0.56rem;
    font-weight: 700;
    white-space: nowrap;
  }
`;

const MobileExport = styled(ExportBtn)`
  height: 36px;
  justify-content: center;
  gap: 4px;
  padding: 0 5px;
  border-radius: 8px;
  font-size: 0.55rem;
  white-space: nowrap;

  svg {
    width: 11px;
    height: 11px;
    flex: 0 0 auto;
  }
`;

const MobileStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const MobileStatCard = styled.div`
  min-height: 84px;
  padding: 12px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(13,34,68,0.07);
  box-shadow: 0 10px 24px rgba(11,31,60,0.07);

  i {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: ${({ $bg }) => $bg || "#eaf3fb"};
    color: ${({ $color }) => $color || "#0254a0"};
    font-style: normal;
    margin-bottom: 8px;
  }

  svg {
    width: 19px;
    height: 19px;
  }

  span {
    display: block;
    color: #071e49;
    font-size: 0.64rem;
    font-weight: 800;
  }

  strong {
    display: block;
    margin-top: 4px;
    color: #071e49;
    font-size: 1rem;
  }
`;

const MobileLeadCard = styled.div`
  padding: 18px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(13,34,68,0.07);
  box-shadow: 0 10px 24px rgba(11,31,60,0.07);
`;

const MobileLeadTop = styled.div`
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
`;

const MobileAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #eaf3fb;
  color: #0254a0;
  font-size: 1.1rem;
  font-weight: 800;
`;

const MobileLeadName = styled.div`
  min-width: 0;

  h3 {
    margin: 0;
    color: #071e49;
    font-size: 0.84rem;
    font-weight: 800;
    line-height: 1.3;
  }

  a, span {
    display: block;
    margin-top: 5px;
    color: #0254a0;
    font-size: 0.72rem;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobilePhone = styled.div`
  margin-top: 9px;
  color: #071e49;
  font-size: 0.74rem;
`;

const MobileLeadMeta = styled.div`
  display: grid;
  gap: 11px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(13,34,68,0.08);
`;

const MobileMetaRow = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  color: #071e49;
  font-size: 0.74rem;

  label {
    color: #64748b;
    font-weight: 700;
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobileCardActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;

  button {
    min-width: 74px;
    height: 34px;
    border-radius: 7px;
    background: #ffffff;
    font: inherit;
    font-size: 0.68rem;
    font-weight: 800;
    cursor: pointer;
  }
`;

const MobileViewBtn = styled.button`
  border: 1px solid #0b66d8;
  color: #0b66d8;
`;

const MobileDeleteBtn = styled.button`
  border: 1px solid #ef4444;
  color: #ef4444;
`;

const STATUSES = ["All", "New", "Contacted", "Follow Up", "Closed"];
const PERIODS = [{ value: "", label: "All Time" }, { value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [period, setPeriod] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const searchTimer = useRef(null);

  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 10, sort, ...(status !== "All" && { status }), ...(period && { period }), ...params });
    if (search) q.set("search", search);
    const res = await api.get(`/leads?${q}`);
    if (res.success) { setLeads(res.leads); setTotal(res.total); setPages(res.pages); }
    setLoading(false);
  }, [page, sort, status, period, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSearch = (v) => {
    setSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 400);
  };

  const openModal = (lead) => {
    setSelected(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes || "");
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await api.patch(`/leads/${selected._id}`, { status: editStatus, notes: editNotes });
    setSaving(false);
    if (res.success) {
      toast.success("Lead updated");
      setSelected(null);
      fetchLeads();
    } else toast.error("Update failed");
  };

  const handleDelete = async () => {
    const res = await api.delete(`/leads/${deleteId}`);
    setDeleteId(null);
    if (res.success) { toast.success("Lead deleted"); fetchLeads(); }
    else toast.error("Delete failed");
  };

  const handleExport = () => {
    const q = new URLSearchParams({ ...(status !== "All" && { status }) });
    api.downloadCSV(`/leads/export/csv?${q}`).catch(() => toast.error("Export failed"));
  };

  const unreadCount = leads.filter((lead) => !lead.isRead).length;
  const newCount = leads.filter((lead) => lead.status === "New").length;

  return (
    <>
    <DesktopLeads>
      <PageHeader>
        <h2>Leads Management</h2>
        <ExportBtn onClick={handleExport}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </ExportBtn>
      </PageHeader>

      <Toolbar>
        <SearchInput placeholder="Search name, email, phone, subject…" value={search} onChange={(e) => handleSearch(e.target.value)} />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={period} onChange={(e) => { setPeriod(e.target.value); setPage(1); }}>
          {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </Select>
      </Toolbar>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Subject</th>
              <th>Message</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((__, j) => <td key={j}><Skeleton /></td>)}</tr>
                ))
              : leads.length === 0
              ? <tr><td colSpan={8}><Empty><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No leads found</p></Empty></td></tr>
              : leads.map((l) => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 600 }}>{l.name}</td>
                    <td style={{ color: "#0254a0" }}>{l.email}</td>
                    <td>{l.phone}</td>
                    <td>{l.subject}</td>
                    <td style={{ color: "#33425e", maxWidth: 180 }}>{l.message.slice(0, 60)}{l.message.length > 60 ? "…" : ""}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td style={{ color: "#33425e", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {new Date(l.createdAt).toLocaleDateString("en-IN")}<br />
                      <span style={{ fontSize: "0.72rem" }}>{new Date(l.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                    <td>
                      <Actions>
                        <ActionBtn onClick={() => openModal(l)}>View</ActionBtn>
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

    </DesktopLeads>

      {selected && (
        <ModalOverlay onClick={() => setSelected(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Lead Details</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </ModalHeader>
            <ModalBody>
              {[
                ["Name", selected.name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Subject", selected.subject],
                ["Message", selected.message],
                ["Submitted", new Date(selected.createdAt).toLocaleString("en-IN")],
              ].map(([label, val]) => (
                <DetailRow key={label}><label>{label}</label><span>{val}</span></DetailRow>
              ))}
              <ModalField>
                <label>Lead Status</label>
                <ModalSelect value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  {["New", "Contacted", "Follow Up", "Closed"].map((s) => <option key={s}>{s}</option>)}
                </ModalSelect>
              </ModalField>
              <ModalField>
                <label>Internal Notes</label>
                <ModalTextarea rows={4} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Add internal notes…" />
              </ModalField>
              <SaveBtn onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</SaveBtn>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Lead"
          message="Are you sure you want to permanently delete this lead? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    <MobileLeads>
      <MobileTitle>Leads Overview</MobileTitle>
      <MobileSearch>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          placeholder="Search name, email, phone, subject..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </MobileSearch>
      <MobileFilterRow>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={period} onChange={(e) => { setPeriod(e.target.value); setPage(1); }}>
          {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <MobileExport onClick={handleExport}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </MobileExport>
      </MobileFilterRow>
      <MobileStatGrid>
        <MobileStatCard $bg="#eaf3fb" $color="#0254a0">
          <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg></i>
          <span>Total Leads</span>
          <strong>{total}</strong>
        </MobileStatCard>
        <MobileStatCard $bg="#dcfce7" $color="#16a34a">
          <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg></i>
          <span>New Leads</span>
          <strong>{newCount}</strong>
        </MobileStatCard>
        <MobileStatCard $bg="#f3e8ff" $color="#7c3aed">
          <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></i>
          <span>Unread</span>
          <strong>{unreadCount}</strong>
        </MobileStatCard>
      </MobileStatGrid>

      <MobileTitle>Leads List</MobileTitle>
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <MobileLeadCard key={index}>
            <Skeleton $h="120px" />
          </MobileLeadCard>
        ))
      ) : leads.length === 0 ? (
        <MobileLeadCard>No leads found</MobileLeadCard>
      ) : (
        leads.map((lead) => (
          <MobileLeadCard key={lead._id}>
            <MobileLeadTop>
              <MobileAvatar>{lead.name?.[0]?.toUpperCase() || "L"}</MobileAvatar>
              <MobileLeadName>
                <h3>{lead.name}</h3>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
                <MobilePhone>{lead.phone}</MobilePhone>
              </MobileLeadName>
              <StatusBadge status={lead.status} />
            </MobileLeadTop>
            <MobileLeadMeta>
              <MobileMetaRow><label>Subject</label><span>{lead.subject}</span></MobileMetaRow>
              <MobileMetaRow><label>Message</label><span>{lead.message}</span></MobileMetaRow>
              <MobileMetaRow><label>Date & Time</label><span>{new Date(lead.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span></MobileMetaRow>
            </MobileLeadMeta>
            <MobileCardActions>
              <MobileViewBtn type="button" onClick={() => openModal(lead)}>View</MobileViewBtn>
              <MobileDeleteBtn type="button" onClick={() => setDeleteId(lead._id)}>Delete</MobileDeleteBtn>
            </MobileCardActions>
          </MobileLeadCard>
        ))
      )}
      <Pagination page={page} pages={pages} total={total} limit={10} onPage={setPage} />
    </MobileLeads>
    </>
  );
}
