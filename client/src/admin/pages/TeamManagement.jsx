import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { canManageUser, hasPermission, roleLabel } from "../permissions";
import { useAuth } from "../context/AuthContext";

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
const PageHeader = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;h2{margin:0 0 6px;color:#0d2244;font-size:1.25rem}p{margin:0;color:#33425e;font-size:.9rem}`;
const Toolbar = styled.div`display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px`;
const Input = styled.input`height:42px;padding:0 14px;border:1.5px solid rgba(13,34,68,.16);border-radius:8px;font:inherit;color:#26395d;outline:none;&:focus{border-color:#0254a0}`;
const Select = styled.select`height:42px;padding:0 12px;border:1.5px solid rgba(13,34,68,.16);border-radius:8px;background:#fff;font:inherit;color:#26395d;outline:none`;
const PrimaryBtn = styled.button`height:42px;padding:0 18px;border:0;border-radius:8px;background:linear-gradient(135deg,#2c649c,#0254a0);color:#fff;font:inherit;font-size:.875rem;font-weight:700;cursor:pointer;&:disabled{opacity:.6;cursor:not-allowed}`;
const TableWrap = styled.div`background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(11,31,60,.07);border:1px solid rgba(13,34,68,.07);overflow:auto`;
const Table = styled.table`width:100%;border-collapse:collapse;font-size:.875rem;th{padding:13px 16px;text-align:left;color:#33425e;font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;background:#f6fbff;border-bottom:1px solid rgba(13,34,68,.08);white-space:nowrap}td{padding:13px 16px;color:#0d2244;border-bottom:1px solid rgba(13,34,68,.06);vertical-align:middle;white-space:nowrap}tr:last-child td{border-bottom:0}tr:hover td{background:#f9fbff}`;
const ActionRow = styled.div`display:flex;gap:6px;flex-wrap:wrap`;
const ActionBtn = styled.button`padding:6px 10px;border-radius:6px;border:1px solid ${({$danger})=>$danger?"#b42318":"rgba(13,34,68,.2)"};background:#fff;color:${({$danger})=>$danger?"#b42318":"#0d2244"};font:inherit;font-size:.76rem;font-weight:700;cursor:pointer;&:hover{background:${({$danger})=>$danger?"#fff5f5":"#f6fbff"}}`;
const Badge = styled.span`display:inline-flex;padding:4px 10px;border-radius:999px;font-size:.74rem;font-weight:700;background:${({$status})=>({Active:"#ecfdf3",Inactive:"#f3f4f6",Suspended:"#fef2f2",Pending:"#fffbeb"}[$status]||"#f3f4f6")};color:${({$status})=>({Active:"#087443",Inactive:"#374151",Suspended:"#b42318",Pending:"#b45309"}[$status]||"#374151")}`;
const Empty = styled.div`padding:56px 24px;text-align:center;color:#33425e;p{margin:0 0 16px}`;
const Skeleton = styled.div`height:16px;width:100%;border-radius:6px;background:linear-gradient(90deg,#f0f4f8 25%,#e8eef5 50%,#f0f4f8 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
const ModalOverlay = styled.div`position:fixed;inset:0;z-index:8000;background:rgba(11,31,60,.45);display:flex;align-items:center;justify-content:center;padding:16px;animation:${fadeIn} .2s ease`;
const Modal = styled.form`width:100%;max-width:760px;max-height:90vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(11,31,60,.22);animation:${fadeIn} .24s ease`;
const ModalHeader = styled.div`display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid rgba(13,34,68,.1);h3{margin:0;color:#0d2244;font-size:1.05rem}button{background:none;border:0;cursor:pointer;color:#33425e;font-size:20px}`;
const ModalBody = styled.div`padding:24px 28px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;@media(max-width:700px){grid-template-columns:1fr}`;
const Field = styled.label`display:grid;gap:7px;color:#0d2244;font-size:.82rem;font-weight:700;input,select{width:100%;box-sizing:border-box;height:42px;border:1px solid rgba(13,34,68,.16);border-radius:8px;padding:0 12px;font:inherit;color:#26395d;outline:none}input:focus,select:focus{border-color:#0254a0}`;
const ModalActions = styled.div`grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;margin-top:8px`;
const SecondaryBtn = styled.button`height:42px;padding:0 18px;border:1px solid rgba(13,34,68,.16);border-radius:8px;background:#fff;color:#0d2244;font:inherit;font-weight:700;cursor:pointer`;

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employeeId: "",
  department: "",
  role: "TEAM_MEMBER",
  customRole: "",
  password: "",
  confirmPassword: "",
  status: "Active",
  profileImage: "",
};

export default function TeamManagement() {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const customRoles = useMemo(() => roles.filter((role) => role.type === "CUSTOM" && role.status === "Active"), [roles]);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const [usersRes, rolesRes] = await Promise.all([api.get(`/users?${params}`), api.get("/roles")]);
    if (usersRes.success) setUsers(usersRes.users);
    if (rolesRes.success) setRoles(rolesRes.roles);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      ...initialForm,
      ...user,
      customRole: user.customRole?._id || user.customRole || "",
      password: "",
      confirmPassword: "",
    });
    setModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editing && form.password !== form.confirmPassword) {
      toast.error("Password and confirmation do not match");
      return;
    }
    setSaving(true);
    const payload = { ...form, customRole: form.customRole || null };
    delete payload.confirmPassword;
    if (editing) delete payload.password;
    const res = editing ? await api.patch(`/users/${editing.id}`, payload) : await api.post("/users", payload);
    setSaving(false);
    if (res.success) {
      toast.success(editing ? "Team member updated" : "Team member created");
      setModalOpen(false);
      load();
    } else {
      toast.error(res.message || "Unable to save team member");
    }
  };

  const quickStatus = async (user, nextStatus) => {
    const res = await api.patch(`/users/${user.id}`, { status: nextStatus });
    if (res.success) {
      toast.success(`User marked ${nextStatus}`);
      load();
    } else toast.error(res.message || "Action denied");
  };

  return (
    <div>
      <PageHeader>
        <div>
          <h2>Team Management</h2>
          <p>Manage administrators and team members.</p>
        </div>
        {hasPermission(admin, "team.create") && <PrimaryBtn onClick={openCreate}>+ Add Team Member</PrimaryBtn>}
      </PageHeader>

      <Toolbar>
        <Input placeholder="Search name, email, department..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {["Active", "Inactive", "Suspended", "Pending"].map((item) => <option key={item}>{item}</option>)}
        </Select>
        <SecondaryBtn onClick={load}>Filter</SecondaryBtn>
      </Toolbar>

      <TableWrap>
        <Table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: 6 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((__, j) => <td key={j}><Skeleton /></td>)}</tr>) :
            users.length === 0 ? <tr><td colSpan={7}><Empty><p>No Team Members Found</p>{hasPermission(admin, "team.create") && <PrimaryBtn onClick={openCreate}>+ Add Team Member</PrimaryBtn>}</Empty></td></tr> :
            users.map((user) => {
              const manageable = canManageUser(admin, user);
              return (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700 }}>{user.name}</td>
                  <td style={{ color: "#0254a0" }}>{user.email}</td>
                  <td>{user.customRole?.name || roleLabel(user.role)}</td>
                  <td>{user.department || "-"}</td>
                  <td><Badge $status={user.status}>{user.status}</Badge></td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN") : "Never"}</td>
                  <td>
                    <ActionRow>
                      <ActionBtn as={Link} to={`/admin/team/${user.id}`}>View</ActionBtn>
                      {manageable && hasPermission(admin, "team.edit") && <ActionBtn onClick={() => openEdit(user)}>Edit</ActionBtn>}
                      {manageable && hasPermission(admin, "team.disable") && user.status === "Active" && <ActionBtn onClick={() => quickStatus(user, "Inactive")}>Disable</ActionBtn>}
                      {manageable && hasPermission(admin, "team.disable") && user.status !== "Active" && <ActionBtn onClick={() => quickStatus(user, "Active")}>Activate</ActionBtn>}
                    </ActionRow>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrap>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onSubmit={handleSave} onClick={(e) => e.stopPropagation()}>
            <ModalHeader><h3>{editing ? "Edit Team Member" : "Add Team Member"}</h3><button type="button" onClick={() => setModalOpen(false)}>x</button></ModalHeader>
            <ModalBody>
              {["firstName", "lastName", "email", "phone", "employeeId", "department"].map((name) => (
                <Field key={name}>{name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                  <input required={["email"].includes(name)} type={name === "email" ? "email" : "text"} value={form[name] || ""} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
                </Field>
              ))}
              <Field>Role
                <select value={form.customRole ? "CUSTOM" : form.role} onChange={(e) => setForm({ ...form, role: e.target.value === "CUSTOM" ? "TEAM_MEMBER" : e.target.value, customRole: "" })}>
                  {admin?.role === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Admin</option>}
                  <option value="ADMIN">Admin</option>
                  <option value="TEAM_MEMBER">Team Member</option>
                  <option value="CUSTOM">Custom Team Role</option>
                </select>
              </Field>
              {(form.customRole || (!["SUPER_ADMIN", "ADMIN"].includes(form.role) && customRoles.length > 0)) && (
                <Field>Custom Role
                  <select value={form.customRole} onChange={(e) => setForm({ ...form, customRole: e.target.value })}>
                    <option value="">Default Team Member</option>
                    {customRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                  </select>
                </Field>
              )}
              <Field>Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {["Active", "Inactive", "Suspended", "Pending"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
              <Field>Profile Image URL<input value={form.profileImage || ""} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} /></Field>
              {!editing && <>
                <Field>Password<input minLength={8} required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
                <Field>Confirm Password<input minLength={8} required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></Field>
              </>}
              <ModalActions><SecondaryBtn type="button" onClick={() => setModalOpen(false)}>Cancel</SecondaryBtn><PrimaryBtn disabled={saving} type="submit">{saving ? "Saving..." : "Save"}</PrimaryBtn></ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}
    </div>
  );
}
