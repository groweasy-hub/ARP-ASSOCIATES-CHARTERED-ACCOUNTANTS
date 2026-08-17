import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { canManageUser, roleLabel } from "../permissions";
import { useAuth } from "../context/AuthContext";

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  h2 {
    margin: 0 0 4px;
    color: #0d2244;
    font-size: 1.08rem;
  }
  p {
    margin: 0;
    color: #33425e;
    font-size: 0.78rem;
  }
`;
const Toolbar = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  min-width: 0;
  margin-bottom: 12px;
`;
const Input = styled.input`
  width: 100%;
  max-width: 240px;
  height: 36px;
  padding: 0 11px;
  border: 1.5px solid rgba(13, 34, 68, 0.16);
  border-radius: 7px;
  font: inherit;
  font-size: 0.78rem;
  color: #26395d;
  outline: none;
  &:focus {
    border-color: #0254a0;
  }
`;
const Select = styled.select`
  height: 36px;
  padding: 0 10px;
  border: 1.5px solid rgba(13, 34, 68, 0.16);
  border-radius: 7px;
  background: #fff;
  font: inherit;
  font-size: 0.78rem;
  color: #26395d;
  outline: none;
`;
const PrimaryBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  background: linear-gradient(135deg, #2c649c, #0254a0);
  color: #fff;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const SecondaryBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(13, 34, 68, 0.16);
  border-radius: 7px;
  background: #fff;
  color: #0d2244;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
`;
const TableWrap = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(11, 31, 60, 0.06);
  border: 1px solid rgba(13, 34, 68, 0.07);
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
`;
const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 0.78rem;
  th {
    padding: 9px 11px;
    text-align: left;
    color: #33425e;
    font-weight: 700;
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: #f6fbff;
    border-bottom: 1px solid rgba(13, 34, 68, 0.08);
    white-space: nowrap;
  }
  td {
    padding: 9px 11px;
    color: #0d2244;
    border-bottom: 1px solid rgba(13, 34, 68, 0.06);
    vertical-align: middle;
    white-space: nowrap;
  }
  tr:last-child td {
    border-bottom: 0;
  }
  tr:hover td {
    background: #f9fbff;
  }
`;
const ActionRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;
const ActionBtn = styled.button`
  padding: 5px 9px;
  border-radius: 6px;
  border: 1px solid
    ${({ $danger }) => ($danger ? "#b42318" : "rgba(13,34,68,.2)")};
  background: #fff;
  color: ${({ $danger }) => ($danger ? "#b42318" : "#0d2244")};
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: ${({ $danger }) => ($danger ? "#fff5f5" : "#f6fbff")};
  }
`;
const Badge = styled.span`
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
  background: ${({ $s }) =>
    ({
      Active: "#ecfdf3",
      Inactive: "#f3f4f6",
      Suspended: "#fef2f2",
      Pending: "#fffbeb",
    })[$s] || "#f3f4f6"};
  color: ${({ $s }) =>
    ({
      Active: "#087443",
      Inactive: "#374151",
      Suspended: "#b42318",
      Pending: "#b45309",
    })[$s] || "#374151"};
`;
const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
`;
const ProfilePhoto = styled.div`
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c649c, #0254a0);
  color: #fff;
  font-size: 0.74rem;
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const Empty = styled.div`
  padding: 38px 18px;
  text-align: center;
  color: #33425e;
  p {
    margin: 0 0 12px;
    font-size: 0.8rem;
  }
`;
const Skeleton = styled.div`
  height: 16px;
  width: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f4f8 25%, #e8eef5 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 8000;
  background: rgba(11, 31, 60, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  animation: ${fadeIn} 0.2s ease;
`;
const Modal = styled.form`
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 24px 70px rgba(11, 31, 60, 0.2);
  animation: ${fadeIn} 0.24s ease;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.1);
  h3 {
    margin: 0;
    color: #0d2244;
    font-size: 0.95rem;
  }
  button {
    background: none;
    border: 0;
    cursor: pointer;
    color: #33425e;
    font-size: 18px;
  }
`;
const ModalBody = styled.div`
  padding: 18px 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.label`
  display: grid;
  gap: 6px;
  color: #0d2244;
  font-size: 0.74rem;
  font-weight: 700;
  input,
  select {
    width: 100%;
    box-sizing: border-box;
    height: 36px;
    border: 1px solid rgba(13, 34, 68, 0.16);
    border-radius: 7px;
    padding: 0 10px;
    font: inherit;
    font-size: 0.78rem;
    color: #26395d;
    outline: none;
  }
  input:focus,
  select:focus {
    border-color: #0254a0;
  }
`;
const ModalActions = styled.div`
  grid-column: 1/-1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const DesktopEmployees = styled.div`
  @media (max-width: 760px) {
    display: none;
  }
`;

const MobileEmployees = styled.div`
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

const MobileToolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 114px 118px;
  gap: 8px;
  align-items: center;
`;

const MobileSearch = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    width: 15px;
    height: 15px;
    transform: translateY(-50%);
    color: #64748b;
  }

  input {
    width: 100%;
    height: 36px;
    box-sizing: border-box;
    border: 1px solid rgba(13, 34, 68, 0.12);
    border-radius: 8px;
    padding: 0 9px 0 32px;
    background: #ffffff;
    color: #071e49;
    font: inherit;
    font-size: 0.62rem;
    outline: none;
  }
`;

const MobileSelect = styled.select`
  width: 100%;
  height: 36px;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;
  padding: 0 6px;
  background: #ffffff;
  color: #071e49;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 700;
  outline: none;
`;

const MobileAddBtn = styled(PrimaryBtn)`
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 0.62rem;
  white-space: nowrap;
`;

const MobileStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const MobileStatCard = styled.div`
  min-height: 108px;
  padding: 12px 10px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.07);
  box-shadow: 0 10px 24px rgba(11, 31, 60, 0.07);

  i {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: ${({ $bg }) => $bg || "#eaf3fb"};
    color: ${({ $color }) => $color || "#0254a0"};
    font-style: normal;
    margin-bottom: 10px;
  }

  svg {
    width: 17px;
    height: 17px;
  }

  span {
    display: block;
    color: #33425e;
    font-size: 0.58rem;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #071e49;
    font-size: 1rem;
    line-height: 1;
  }

  small {
    display: block;
    margin-top: 7px;
    color: #64748b;
    font-size: 0.54rem;
  }
`;

const MobileEmployeeList = styled.div`
  display: grid;
  gap: 10px;
`;

const MobileEmployeeCard = styled.div`
  padding: 14px 16px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.07);
  box-shadow: 0 10px 24px rgba(11, 31, 60, 0.07);
`;

const MobileEmployeeTop = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
`;

const MobilePhoto = styled(ProfilePhoto)`
  width: 52px;
  height: 52px;
  flex-basis: 52px;
  font-size: 1.15rem;
`;

const MobileEmployeeName = styled.div`
  min-width: 0;

  h3 {
    margin: 0;
    color: #071e49;
    font-size: 0.78rem;
    font-weight: 800;
    line-height: 1.25;
  }

  strong,
  a {
    display: block;
    margin-top: 5px;
    color: #0254a0;
    font-size: 0.64rem;
    font-weight: 700;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobileEmployeeMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(13, 34, 68, 0.08);
`;

const MobileMetaItem = styled.div`
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 8px;
  color: #071e49;

  svg {
    width: 14px;
    height: 14px;
    color: #64748b;
  }

  label {
    display: block;
    color: #64748b;
    font-size: 0.56rem;
  }

  span {
    display: block;
    color: #071e49;
    font-size: 0.62rem;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobileActions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 13px;
`;

const MobileActionButton = styled.button`
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid ${({ $danger }) => ($danger ? "#fecaca" : "rgba(13, 34, 68, 0.14)")};
  border-radius: 7px;
  background: #ffffff;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#0b66d8")};
  font: inherit;
  font-size: 0.58rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const MobileActionLink = styled(MobileActionButton).attrs({ as: Link })``;

const ROLE_HIERARCHY = [
  "INTERN",
  "ARTICLE_ASSISTANT",
  "PAID_ASSISTANT",
  "EMPLOYEE",
  "ACCOUNTS_AND_AUDIT_EXECUTIVE",
  "ACCOUNTANT",
  "SENIOR_ACCOUNTANT",
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

const ROLE_LIST_ORDER = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "SENIOR_ACCOUNTANT",
  "ACCOUNTANT",
  "ACCOUNTS_AND_AUDIT_EXECUTIVE",
  "EMPLOYEE",
  "PAID_ASSISTANT",
  "ARTICLE_ASSISTANT",
  "INTERN",
];

const ROLE_ALIASES = {
  "Super Admin": "SUPER_ADMIN",
  Admin: "ADMIN",
  Manager: "MANAGER",
  "Senior Accountant": "SENIOR_ACCOUNTANT",
  Accountant: "ACCOUNTANT",
  "Accounts and Audit Executive": "ACCOUNTS_AND_AUDIT_EXECUTIVE",
  "Paid Assistant": "PAID_ASSISTANT",
  "Article Assistant": "ARTICLE_ASSISTANT",
  Intern: "INTERN",
};

const roleSortIndex = (role) => {
  const normalizedRole = ROLE_ALIASES[role] || role;
  const index = ROLE_LIST_ORDER.indexOf(normalizedRole);
  return index === -1 ? ROLE_LIST_ORDER.length : index;
};

const roleLevel = (role) => ROLE_HIERARCHY.indexOf(role);

const assignableRolesFor = (actorRole) =>
  ROLE_LIST_ORDER.filter((role) => {
    const actorLevel = roleLevel(actorRole);
    const targetLevel = roleLevel(role);
    return actorLevel > -1 && targetLevel > -1 && actorLevel > targetLevel;
  });

const sortUsersByRole = (items) =>
  [...items].sort((a, b) => {
    const roleDiff = roleSortIndex(a.role) - roleSortIndex(b.role);
    if (roleDiff !== 0) return roleDiff;
    return (a.name || a.email || "").localeCompare(b.name || b.email || "");
  });

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employeeId: "",
  designation: "",
  department: "",
  address: "",
  dateOfJoining: "",
  role: "EMPLOYEE",
  teamMate: "", // free-text teammate name
  password: "",
  confirmPassword: "",
  status: "Active",
  profileImage: "",
};

export default function TeamManagement() {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    const res = await api.get(`/users?${params}`);
    if (res.success) setUsers(sortUsersByRole(res.users || []));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  useEffect(() => {
    const timer = setTimeout(() => load(), 350);
    return () => clearTimeout(timer);
  }, [search, statusFilter]); // eslint-disable-line

  const openCreate = () => {
    const roles = assignableRolesFor(admin?.role);
    setEditing(null);
    setForm({ ...initialForm, role: roles[0] || "EMPLOYEE" });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      ...initialForm,
      ...user,
      teamMate: user.teamMate || "",
      password: "",
      confirmPassword: "",
    });
    setModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        profileImage: reader.result || "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const roles = assignableRolesFor(admin?.role);
    if (!editing && !roles.includes(form.role)) {
      toast.error("You can only create employees below your role level");
      return;
    }
    if (!editing && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    const payload = { ...form };
    delete payload.confirmPassword;
    if (editing) delete payload.password;
    if (
      editing &&
      admin?.role === "SUPER_ADMIN" &&
      String(editing.id) === String(admin?.id)
    ) {
      delete payload.role;
      delete payload.status;
    }
    const res = editing
      ? await api.patch(`/users/${editing.id}`, payload)
      : await api.post("/users", payload);
    setSaving(false);
    if (res.success) {
      toast.success(editing ? "Employee updated" : "Employee added");
      setModalOpen(false);
      load();
    } else {
      toast.error(res.message || "Unable to save employee");
    }
  };

  const quickStatus = async (user, next) => {
    const res = await api.patch(`/users/${user.id}`, { status: next });
    if (res.success) {
      toast.success(`Marked ${next}`);
      load();
    } else toast.error(res.message || "Action denied");
  };

  const handleDelete = async () => {
    const res = await api.delete(`/users/${deleteId}`);
    setDeleteId(null);
    if (res.success) {
      toast.success("Employee deleted");
      load();
    } else toast.error(res.message || "Delete failed");
  };

  const employeeStats = {
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    admins: users.filter((user) => user.role === "ADMIN").length,
    superAdmins: users.filter((user) => user.role === "SUPER_ADMIN").length,
  };

  return (
    <>
    <DesktopEmployees>
      <PageHeader>
        <div>
          <h2>Employees</h2>
          <p>Manage employees, roles, login access and profile details.</p>
        </div>
        <PrimaryBtn onClick={openCreate}>+ Add Employee</PrimaryBtn>
      </PageHeader>

      <Toolbar>
        <Input
          placeholder="Search name, email, department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {["Active", "Inactive", "Suspended", "Pending"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
        <SecondaryBtn type="button" onClick={load}>
          Filter
        </SecondaryBtn>
      </Toolbar>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j}>
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <Empty>
                    <p>No employees found</p>
                    <PrimaryBtn onClick={openCreate}>+ Add Employee</PrimaryBtn>
                  </Empty>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const manageable = canManageUser(admin, user);
                const canEditOwnProfile =
                  admin?.role === "SUPER_ADMIN" &&
                  String(user.id) === String(admin?.id);
                const editable = manageable || canEditOwnProfile;
                return (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 700 }}>
                      <NameCell>
                        <ProfilePhoto>
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name || "Employee"}
                            />
                          ) : (
                            (user.name || user.email || "E")
                              .slice(0, 1)
                              .toUpperCase()
                          )}
                        </ProfilePhoto>
                        <span>{user.name}</span>
                      </NameCell>
                    </td>
                    <td style={{ color: "#33425e", fontWeight: 700 }}>
                      {user.employeeId || "-"}
                    </td>
                    <td style={{ color: "#0254a0" }}>{user.email}</td>
                    <td>{roleLabel(user.role)}</td>
                    <td>{user.designation || "—"}</td>
                    <td>{user.department || "—"}</td>
                    <td>
                      <Badge $s={user.status}>{user.status}</Badge>
                    </td>
                    <td>
                      <ActionRow>
                        <ActionBtn as={Link} to={`/admin/employees/${user.id}`}>
                          View
                        </ActionBtn>
                        {editable && (
                          <ActionBtn onClick={() => openEdit(user)}>
                            Edit
                          </ActionBtn>
                        )}
                        {manageable && user.status === "Active" && (
                          <ActionBtn
                            onClick={() => quickStatus(user, "Inactive")}
                          >
                            Disable
                          </ActionBtn>
                        )}
                        {manageable && user.status !== "Active" && (
                          <ActionBtn
                            onClick={() => quickStatus(user, "Active")}
                          >
                            Activate
                          </ActionBtn>
                        )}
                        {admin?.role === "SUPER_ADMIN" && manageable && (
                          <ActionBtn
                            $danger
                            onClick={() => setDeleteId(user.id)}
                          >
                            Delete
                          </ActionBtn>
                        )}
                      </ActionRow>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableWrap>

    </DesktopEmployees>

      <MobileEmployees>
        <MobileTitle>Employees Overview</MobileTitle>
        <MobileToolbar>
          <MobileSearch>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input
              placeholder="Search by name, email or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </MobileSearch>
          <MobileSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {["Active", "Inactive", "Suspended", "Pending"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </MobileSelect>
          <MobileAddBtn onClick={openCreate}>+ Add Employee</MobileAddBtn>
        </MobileToolbar>

        <MobileStatsGrid>
          <MobileStatCard $bg="#eaf3fb" $color="#0254a0">
            <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg></i>
            <span>Total Employees</span>
            <strong>{employeeStats.total}</strong>
            <small>All registered users</small>
          </MobileStatCard>
          <MobileStatCard $bg="#dcfce7" $color="#16a34a">
            <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg></i>
            <span>Active</span>
            <strong>{employeeStats.active}</strong>
            <small>Currently active</small>
          </MobileStatCard>
          <MobileStatCard $bg="#f3e8ff" $color="#7c3aed">
            <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a6 6 0 0 1 12 0v2" /></svg></i>
            <span>Admins</span>
            <strong>{employeeStats.admins}</strong>
            <small>Admin users</small>
          </MobileStatCard>
        </MobileStatsGrid>

        <MobileEmployeeList>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <MobileEmployeeCard key={index}>
                <Skeleton />
              </MobileEmployeeCard>
            ))
          ) : users.length === 0 ? (
            <Empty>
              <p>No employees found</p>
              <PrimaryBtn onClick={openCreate}>+ Add Employee</PrimaryBtn>
            </Empty>
          ) : (
            users.map((user) => {
              const manageable = canManageUser(admin, user);
              const canEditOwnProfile =
                admin?.role === "SUPER_ADMIN" &&
                String(user.id) === String(admin?.id);
              const editable = manageable || canEditOwnProfile;
              return (
                <MobileEmployeeCard key={user.id}>
                  <MobileEmployeeTop>
                    <MobilePhoto>
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name || "Employee"} />
                      ) : (
                        (user.name || user.email || "E").slice(0, 1).toUpperCase()
                      )}
                    </MobilePhoto>
                    <MobileEmployeeName>
                      <h3>{user.name}</h3>
                      <strong>{user.employeeId || "-"}</strong>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </MobileEmployeeName>
                    <Badge $s={user.status}>{user.status}</Badge>
                  </MobileEmployeeTop>

                  <MobileEmployeeMeta>
                    <MobileMetaItem>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      <div><label>Role</label><span>{roleLabel(user.role)}</span></div>
                    </MobileMetaItem>
                    <MobileMetaItem>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /></svg>
                      <div><label>Department</label><span>{user.department || "-"}</span></div>
                    </MobileMetaItem>
                    <MobileMetaItem>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M12 12v.01" /></svg>
                      <div><label>Designation</label><span>{user.designation || "-"}</span></div>
                    </MobileMetaItem>
                  </MobileEmployeeMeta>

                  <MobileActions>
                    <MobileActionLink to={`/admin/employees/${user.id}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      View
                    </MobileActionLink>
                    {editable && (
                      <MobileActionButton type="button" onClick={() => openEdit(user)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                        Edit
                      </MobileActionButton>
                    )}
                    {manageable && user.status === "Active" && (
                      <MobileActionButton type="button" onClick={() => quickStatus(user, "Inactive")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                        Disable
                      </MobileActionButton>
                    )}
                    {manageable && user.status !== "Active" && (
                      <MobileActionButton type="button" onClick={() => quickStatus(user, "Active")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                        Activate
                      </MobileActionButton>
                    )}
                    {admin?.role === "SUPER_ADMIN" && manageable && (
                      <MobileActionButton $danger type="button" onClick={() => setDeleteId(user.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                        Delete
                      </MobileActionButton>
                    )}
                  </MobileActions>
                </MobileEmployeeCard>
              );
            })
          )}
        </MobileEmployeeList>
      </MobileEmployees>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onSubmit={handleSave} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{editing ? "Edit Employee" : "Add Employee"}</h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </ModalHeader>
            <ModalBody>
              {[
                {
                  name: "firstName",
                  label: "First Name",
                  placeholder: "Amit",
                },
                {
                  name: "lastName",
                  label: "Last Name",
                  placeholder: "Sharma",
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                  placeholder: "amit.sharma@example.com",
                },
                {
                  name: "phone",
                  label: "Phone",
                  placeholder: "+91 98765 43210",
                },
                ...(editing
                  ? [
                      {
                        name: "employeeId",
                        label: "Employee ID",
                        placeholder: "ARP12345",
                      },
                    ]
                  : []),
                {
                  name: "designation",
                  label: "Designation",
                  placeholder: "Senior Accountant",
                },
                {
                  name: "department",
                  label: "Department",
                  placeholder: "Accounts",
                },
                {
                  name: "address",
                  label: "Address",
                  placeholder: "123 MG Road, New Delhi",
                },
                {
                  name: "dateOfJoining",
                  label: "Date of Joining",
                  type: "date",
                  placeholder: "dd-mm-yyyy",
                },
              ].map(({ name, label, type = "text", required, placeholder }) => (
                <Field key={name}>
                  {label}
                  <input
                    pattern={name === "employeeId" ? "ARP[0-9]{5,}" : undefined}
                    required={required}
                    type={type}
                    placeholder={placeholder}
                    value={
                      name === "dateOfJoining" && form[name]
                        ? String(form[name]).slice(0, 10)
                        : form[name] || ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [name]: name === "employeeId" ? e.target.value.toUpperCase() : e.target.value,
                      })
                    }
                  />
                </Field>
              ))}

              {/* Role — no Super Admin, no Team Member */}
              <Field>
                Role
                <select
                  disabled={
                    editing &&
                    admin?.role === "SUPER_ADMIN" &&
                    String(editing.id) === String(admin?.id)
                  }
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {(editing && !assignableRolesFor(admin?.role).includes(form.role)
                    ? [form.role, ...assignableRolesFor(admin?.role)]
                    : assignableRolesFor(admin?.role)
                  ).map((r) => (
                    <option key={r} value={r}>
                      {roleLabel(r)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                Status
                <select
                  disabled={
                    editing &&
                    admin?.role === "SUPER_ADMIN" &&
                    String(editing.id) === String(admin?.id)
                  }
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Active", "Inactive", "Suspended", "Pending"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field>
                Upload Image
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
              </Field>

              {!editing && (
                <>
                  <Field>
                    Password
                    <input
                      minLength={8}
                      required
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    Confirm Password
                    <input
                      minLength={8}
                      required
                      type="password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                    />
                  </Field>
                </>
              )}

              <ModalActions>
                <SecondaryBtn type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={saving} type="submit">
                  {saving ? "Saving…" : "Save"}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Employee"
          message="Are you sure? You can only delete employees at a lower role level than yours."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  );
}
