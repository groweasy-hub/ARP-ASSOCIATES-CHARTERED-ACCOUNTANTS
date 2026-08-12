import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { hasPermission } from "../permissions";
import { useAuth } from "../context/AuthContext";

const PageHeader = styled.div`display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:22px;h2{margin:0 0 6px;color:#0d2244;font-size:1.25rem}p{margin:0;color:#33425e;font-size:.9rem}`;
const Button = styled.button`height:42px;padding:0 18px;border:0;border-radius:8px;background:linear-gradient(135deg,#2c649c,#0254a0);color:#fff;font:inherit;font-weight:700;cursor:pointer;&:disabled{opacity:.6}`;
const TableWrap = styled.div`background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(11,31,60,.07);border:1px solid rgba(13,34,68,.07);overflow:auto`;
const Table = styled.table`width:100%;border-collapse:collapse;font-size:.875rem;th{padding:13px 16px;text-align:left;color:#33425e;font-size:.72rem;text-transform:uppercase;background:#f6fbff;border-bottom:1px solid rgba(13,34,68,.08)}td{padding:13px 16px;color:#0d2244;border-bottom:1px solid rgba(13,34,68,.06)}tr:last-child td{border-bottom:0}`;
const ActionBtn = styled.button`padding:6px 10px;border-radius:6px;border:1px solid rgba(13,34,68,.2);background:#fff;color:#0d2244;font:inherit;font-size:.76rem;font-weight:700;cursor:pointer`;
const ModalOverlay = styled.div`position:fixed;inset:0;z-index:8000;background:rgba(11,31,60,.45);display:flex;align-items:center;justify-content:center;padding:16px`;
const Modal = styled.form`background:#fff;width:100%;max-width:880px;max-height:90vh;overflow:auto;border-radius:16px;box-shadow:0 24px 80px rgba(11,31,60,.22)`;
const ModalHeader = styled.div`display:flex;justify-content:space-between;padding:22px 28px;border-bottom:1px solid rgba(13,34,68,.1);h3{margin:0;color:#0d2244}button{background:none;border:0;font-size:20px;cursor:pointer}`;
const ModalBody = styled.div`padding:24px 28px;display:grid;gap:16px`;
const Field = styled.label`display:grid;gap:7px;color:#0d2244;font-size:.82rem;font-weight:700;input,textarea,select{box-sizing:border-box;width:100%;border:1px solid rgba(13,34,68,.16);border-radius:8px;padding:11px 12px;font:inherit;color:#26395d;outline:none}`;
const Matrix = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;@media(max-width:760px){grid-template-columns:1fr}`;
const Group = styled.div`border:1px solid rgba(13,34,68,.09);border-radius:12px;padding:14px;background:#fbfdff;h4{margin:0 0 10px;color:#0d2244;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em}label{display:flex;align-items:center;gap:8px;color:#33425e;font-size:.84rem;margin:8px 0;font-weight:600}`;
const Actions = styled.div`display:flex;justify-content:flex-end;gap:10px`;
const SecondaryBtn = styled.button`height:42px;padding:0 18px;border:1px solid rgba(13,34,68,.16);border-radius:8px;background:#fff;color:#0d2244;font:inherit;font-weight:700;cursor:pointer`;

const initialForm = { name: "", description: "", baseRole: "TEAM_MEMBER", permissions: [], status: "Active" };

export default function RolesPermissions() {
  const { admin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await api.get("/roles");
    if (res.success) { setRoles(res.roles); setGroups(res.permissionGroups); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(initialForm); setModalOpen(true); };
  const openEdit = (role) => { setEditing(role); setForm({ ...initialForm, ...role, permissions: role.permissions || [] }); setModalOpen(true); };

  const togglePermission = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const res = editing ? await api.patch(`/roles/${editing.id}`, form) : await api.post("/roles", form);
    setSaving(false);
    if (res.success) { toast.success(editing ? "Role updated" : "Role created"); setModalOpen(false); load(); }
    else toast.error(res.message || "Unable to save role");
  };

  return (
    <div>
      <PageHeader><div><h2>Roles & Permissions</h2><p>Create custom team roles with reusable permissions.</p></div>{hasPermission(admin, "roles.create") && <Button onClick={openCreate}>+ Create Role</Button>}</PageHeader>
      <TableWrap><Table><thead><tr><th>Role</th><th>Members</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {roles.map((role) => <tr key={role.id}><td style={{ fontWeight: 700 }}>{role.name}</td><td>{role.members || 0} Member{role.members === 1 ? "" : "s"}</td><td>{role.description || "-"}</td><td>{role.status}</td><td>{role.type === "CUSTOM" && hasPermission(admin, "roles.edit") ? <ActionBtn onClick={() => openEdit(role)}>Edit</ActionBtn> : "System"}</td></tr>)}
      </tbody></Table></TableWrap>
      {modalOpen && <ModalOverlay onClick={() => setModalOpen(false)}><Modal onSubmit={save} onClick={(e) => e.stopPropagation()}><ModalHeader><h3>{editing ? "Edit Role" : "Create Role"}</h3><button type="button" onClick={() => setModalOpen(false)}>x</button></ModalHeader><ModalBody>
        <Field>Role Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field>Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <Field>Base Role<select value={form.baseRole} onChange={(e) => setForm({ ...form, baseRole: e.target.value })}><option value="TEAM_MEMBER">Team Member</option><option value="ADMIN">Admin</option></select></Field>
        <Matrix>{groups.map((group) => <Group key={group.title}><h4>{group.title}</h4>{group.permissions.map((permission) => <label key={permission.name}><input type="checkbox" checked={form.permissions.includes(permission.name)} onChange={() => togglePermission(permission.name)} />{permission.label}</label>)}</Group>)}</Matrix>
        <Actions><SecondaryBtn type="button" onClick={() => setModalOpen(false)}>Cancel</SecondaryBtn><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Role"}</Button></Actions>
      </ModalBody></Modal></ModalOverlay>}
    </div>
  );
}
