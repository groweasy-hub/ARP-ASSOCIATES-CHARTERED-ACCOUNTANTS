import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 22px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(11,31,60,0.06);
  border: 1px solid rgba(13,34,68,0.07);
  animation: ${fadeUp} 0.4s cubic-bezier(0.22,1,0.36,1) both;
  animation-delay: ${({ $i }) => $i * 80}ms;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardIcon = styled.div`
  width: 38px; height: 38px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg || "#eaf3fb"};
  display: flex; align-items: center; justify-content: center;
  color: ${({ $color }) => $color || "#0254a0"};
  svg { width: 18px; height: 18px; }
`;

const CardLabel = styled.p`margin: 0; color: #33425e; font-size: 0.72rem; font-weight: 500;`;
const CardValue = styled.h2`margin: 0; color: #0d2244; font-size: 1.45rem; font-weight: 700; letter-spacing: 0;`;
const CardSub = styled.p`margin: 0; color: #33425e; font-size: 0.68rem;`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  color: #0d2244;
  font-size: 0.9rem;
  font-weight: 700;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 4px 0 12px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  label {
    display: grid;
    gap: 4px;
    color: #33425e;
    font-size: 0.66rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  input {
    height: 34px;
    border: 1px solid rgba(13,34,68,0.16);
    border-radius: 7px;
    padding: 0 9px;
    color: #0d2244;
    font: inherit;
    font-size: 0.76rem;
    outline: none;
  }

  input:focus {
    border-color: #0254a0;
  }
`;

const RecentTable = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(11,31,60,0.06);
  border: 1px solid rgba(13,34,68,0.07);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;

  th { padding: 10px 12px; text-align: left; color: #33425e; font-weight: 600; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; background: #f6fbff; border-bottom: 1px solid rgba(13,34,68,0.08); }
  td { padding: 10px 12px; color: #0d2244; border-bottom: 1px solid rgba(13,34,68,0.06); }
  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: #f9fbff; }
`;

const Skeleton = styled.div`
  height: ${({ $h }) => $h || "20px"};
  width: ${({ $w }) => $w || "100%"};
  background: linear-gradient(90deg, #f0f4f8 25%, #e8eef5 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;

const StatusDot = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 8px; border-radius: 9999px; font-size: 0.66rem; font-weight: 600;
  background: ${({ $s }) => ({ New: "#eaf3fb", Contacted: "#ecfdf3", "Follow Up": "#fffbeb", Closed: "#f3f4f6" }[$s] || "#f3f4f6")};
  color: ${({ $s }) => ({ New: "#0254a0", Contacted: "#087443", "Follow Up": "#b45309", Closed: "#374151" }[$s] || "#374151")};
`;

const DesktopDashboard = styled.div`
  @media (max-width: 760px) {
    display: none;
  }
`;

const MobileDashboard = styled.div`
  display: none;

  @media (max-width: 760px) {
    display: grid;
    gap: 12px;
  }
`;

const MobileWelcome = styled.div`
  min-height: 126px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f5faff 100%);
  border: 1px solid rgba(13,34,68,0.08);
  box-shadow: 0 12px 30px rgba(11,31,60,0.08);

  h2 {
    margin: 0 0 8px;
    color: #071e49;
    font-size: 1rem;
    line-height: 1.25;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #53627a;
    font-size: 0.78rem;
    line-height: 1.55;
  }

  svg {
    width: 88px;
    min-width: 88px;
  }
`;

const MobileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const MobileStatCard = styled(Link)`
  min-height: 120px;
  padding: 12px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(13,34,68,0.07);
  box-shadow: 0 10px 24px rgba(11,31,60,0.07);
  color: #071e49;
  text-decoration: none;
  display: grid;
  align-content: start;
  gap: 8px;

  &:nth-child(n + 4) {
    grid-column: span 1.5;
  }

  strong {
    font-size: 0.72rem;
    line-height: 1.25;
  }

  b {
    font-size: 1.1rem;
    line-height: 1;
  }

  span {
    color: #53627a;
    font-size: 0.68rem;
  }
`;

const MobileStatIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: ${({ $color }) => $color || "#0254a0"};
  background: ${({ $bg }) => $bg || "#eaf3fb"};

  svg {
    width: 22px;
    height: 22px;
  }
`;

const MobileWideStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const MobilePanel = styled.div`
  padding: 14px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(13,34,68,0.07);
  box-shadow: 0 10px 24px rgba(11,31,60,0.07);

  h3 {
    margin: 0 0 12px;
    color: #071e49;
    font-size: 0.9rem;
  }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
`;

const QuickAction = styled(Link)`
  display: grid;
  justify-items: center;
  gap: 7px;
  color: #071e49;
  text-decoration: none;
  font-size: 0.68rem;
  font-weight: 700;

  i {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(13,34,68,0.08);
    border-radius: 14px;
    background: ${({ $bg }) => $bg || "#f6fbff"};
    color: ${({ $color }) => $color || "#0254a0"};
    font-style: normal;
  }

  svg {
    width: 23px;
    height: 23px;
  }
`;

const MobileListItem = styled(Link)`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(13,34,68,0.09);
  border-radius: 14px;
  color: #071e49;
  text-decoration: none;

  strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.78rem;
  }

  span {
    display: block;
    margin-top: 3px;
    color: #53627a;
    font-size: 0.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobileInitial = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${({ $bg }) => $bg || "#eaf3fb"};
  color: ${({ $color }) => $color || "#0254a0"};
  font-weight: 800;
`;

function AnimatedCount({ target }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / 30);
    ref.current = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(ref.current); }
      else setVal(start);
    }, 30);
    return () => clearInterval(ref.current);
  }, [target]);
  return <>{val}</>;
}

const formatDateInput = (date) => date.toISOString().slice(0, 10);
const monthStart = () => {
  const date = new Date();
  return formatDateInput(new Date(date.getFullYear(), date.getMonth(), 1));
};
const today = () => formatDateInput(new Date());
const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const statCards = (s) => [
  { label: "Total Leads", value: s.total, sub: "All time", bg: "#eaf3fb", color: "#0254a0", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: "New Leads Today", value: s.today, sub: "Since midnight", bg: "#ecfdf3", color: "#087443", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: "Total Messages", value: s.messages, sub: "Contact form", bg: "#f0f4ff", color: "#4f46e5", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: "Pending Leads", value: s.pending, sub: "New + Follow Up", bg: "#fffbeb", color: "#b45309", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { label: "Contacted", value: s.contacted, sub: "Leads contacted", bg: "#f0fdf4", color: "#15803d", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
];

const billingCards = (s) => [
  { label: "Invoices Raised", value: s.invoicesRaised || 0, sub: "Selected period", bg: "#eaf3fb", color: "#0254a0", type: "number", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg> },
  { label: "Invoice Amount", value: s.invoiceAmount || 0, sub: "Total billed", bg: "#f0f4ff", color: "#4f46e5", type: "currency", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg> },
  { label: "Amount Paid", value: s.paidAmount || 0, sub: "Payments received", bg: "#ecfdf3", color: "#087443", type: "currency", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/><path d="M3 6h18v12H3z"/></svg> },
  { label: "Pending Amount", value: s.pendingAmount || 0, sub: "Outstanding", bg: "#fffbeb", color: "#b45309", type: "currency", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { label: "Pending Invoices", value: s.paymentPendingInvoices || 0, sub: "Awaiting payment", bg: "#fef2f2", color: "#b42318", type: "number", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [billingStats, setBillingStats] = useState(null);
  const [dateRange, setDateRange] = useState({ from: monthStart(), to: today() });
  const [recent, setRecent] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/leads/stats"), api.get("/leads?limit=5&sort=newest"), api.get("/tasks"), api.get("/users")])
      .then(([s, l, t, u]) => {
        if (s.success) setStats(s.stats);
        if (l.success) setRecent(l.leads);
        if (t.success) setTasks(t.tasks || []);
        if (u.success) setEmployees(u.users || []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setBillingLoading(true);
    const params = new URLSearchParams();
    if (dateRange.from) params.set("from", dateRange.from);
    if (dateRange.to) params.set("to", dateRange.to);
    api.get(`/billing/stats?${params}`)
      .then((res) => {
        if (res.success) setBillingStats(res.stats);
      })
      .finally(() => setBillingLoading(false));
  }, [dateRange]);

  const pendingTasks = tasks.filter((task) => task.workStatus !== "Completed");
  const activeEmployees = employees.filter((employee) => employee.status === "Active");
  const mobileTopCards = [
    { label: "Invoices Raised", value: billingStats?.invoicesRaised || 0, sub: "This month", to: "/admin/clients", bg: "#eaf3fb", color: "#0254a0", icon: billingCards({})[0].icon },
    { label: "Amount Paid", value: formatCurrency(billingStats?.paidAmount || 0), sub: "This month", to: "/admin/clients", bg: "#ecfdf3", color: "#087443", icon: billingCards({})[2].icon },
    { label: "Pending Leads", value: stats?.pending || 0, sub: "New + Follow Up", to: "/admin/leads", bg: "#fff7ed", color: "#c45a00", icon: statCards({})[3].icon },
  ];
  const mobileWideCards = [
    { label: "Pending Tasks", value: pendingTasks.length, sub: "Needs attention", to: "/admin/tasks", bg: "#f3e8ff", color: "#7c3aed", icon: statCards({})[3].icon },
    { label: "Employees", value: activeEmployees.length, sub: "Active", to: "/admin/employees", bg: "#eaf3fb", color: "#0254a0", icon: statCards({})[0].icon },
  ];
  const quickActions = [
    { label: "Leads", to: "/admin/leads", bg: "#eaf3fb", color: "#0254a0", icon: statCards({})[0].icon },
    { label: "Clients", to: "/admin/clients", bg: "#ecfdf3", color: "#087443", icon: billingCards({})[1].icon },
    { label: "Tasks", to: "/admin/tasks", bg: "#fff7ed", color: "#c45a00", icon: mobileWideCards[0].icon },
    { label: "Employees", to: "/admin/employees", bg: "#f3e8ff", color: "#7c3aed", icon: mobileWideCards[1].icon },
    { label: "Settings", to: "/admin/settings", bg: "#f8fafc", color: "#071e49", icon: navGearIcon },
  ].filter((item) => ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(admin?.role) || !["Employees"].includes(item.label));
  const firstTask = pendingTasks[0];

  return (
    <>
      <MobileDashboard>
        <MobileWelcome>
          <div>
            <h2>Welcome back, {(admin?.firstName || admin?.name || "Admin").split(" ")[0]}!</h2>
            <p>Here's what's happening in your workspace today.</p>
          </div>
          <svg viewBox="0 0 120 100" fill="none" aria-hidden="true">
            <rect x="28" y="12" width="62" height="76" rx="8" fill="#d8ebff"/>
            <rect x="36" y="24" width="46" height="6" rx="3" fill="#8bbcf4"/>
            <rect x="38" y="58" width="10" height="18" rx="2" fill="#3b82f6"/>
            <rect x="54" y="46" width="10" height="30" rx="2" fill="#60a5fa"/>
            <rect x="70" y="36" width="10" height="40" rx="2" fill="#93c5fd"/>
            <circle cx="84" cy="74" r="24" fill="#3b82f6"/>
            <path d="m73 74 8 8 15-18" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </MobileWelcome>

        <MobileStats>
          {mobileTopCards.map((card) => (
            <MobileStatCard key={card.label} to={card.to}>
              <MobileStatIcon $bg={card.bg} $color={card.color}>{card.icon}</MobileStatIcon>
              <strong>{card.label}</strong>
              <b>{card.value}</b>
              <span>{card.sub}</span>
            </MobileStatCard>
          ))}
        </MobileStats>
        <MobileWideStats>
          {mobileWideCards.map((card) => (
            <MobileStatCard key={card.label} to={card.to}>
              <MobileStatIcon $bg={card.bg} $color={card.color}>{card.icon}</MobileStatIcon>
              <strong>{card.label}</strong>
              <b>{card.value}</b>
              <span>{card.sub}</span>
            </MobileStatCard>
          ))}
        </MobileWideStats>

        <MobilePanel>
          <h3>Quick Actions</h3>
          <QuickGrid>
            {quickActions.map((item) => (
              <QuickAction key={item.label} to={item.to} $bg={item.bg} $color={item.color}>
                <i>{item.icon}</i>
                {item.label}
              </QuickAction>
            ))}
          </QuickGrid>
        </MobilePanel>

        <MobilePanel>
          <h3>Recent Leads</h3>
          {recent[0] ? (
            <MobileListItem to="/admin/leads">
              <MobileInitial>{recent[0].name?.[0]?.toUpperCase() || "L"}</MobileInitial>
              <div>
                <strong>{recent[0].name}</strong>
                <span>{recent[0].email}</span>
              </div>
              <StatusDot $s={recent[0].status}>{recent[0].status}</StatusDot>
            </MobileListItem>
          ) : (
            <CardSub>No leads yet</CardSub>
          )}
        </MobilePanel>

        <MobilePanel>
          <h3>Pending Task</h3>
          {firstTask ? (
            <MobileListItem to="/admin/tasks">
              <MobileInitial $bg="#fff7ed" $color="#c45a00">!</MobileInitial>
              <div>
                <strong>{firstTask.service}</strong>
                <span>{firstTask.client?.companyName || firstTask.client?.name || "Client"} | Due: {firstTask.dueDate ? new Date(firstTask.dueDate).toLocaleDateString("en-IN") : "-"}</span>
              </div>
              <StatusDot $s="Follow Up">{firstTask.workStatus}</StatusDot>
            </MobileListItem>
          ) : (
            <CardSub>No pending tasks</CardSub>
          )}
        </MobilePanel>
      </MobileDashboard>

      <DesktopDashboard>
      <SectionHeader>
        <SectionTitle style={{ margin: 0 }}>Billing Summary</SectionTitle>
        <FilterBar>
          <label>
            From
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((current) => ({ ...current, from: e.target.value }))}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((current) => ({ ...current, to: e.target.value }))}
            />
          </label>
        </FilterBar>
      </SectionHeader>
      <Grid>
        {billingLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} $i={i}>
                <Skeleton $h="48px" $w="48px" style={{ borderRadius: 12 }} />
                <Skeleton $h="14px" $w="60%" />
                <Skeleton $h="36px" $w="55%" />
              </Card>
            ))
          : billingCards(billingStats || {}).map((c, i) => (
              <Card key={c.label} $i={i}>
                <CardIcon $bg={c.bg} $color={c.color}>{c.icon}</CardIcon>
                <CardLabel>{c.label}</CardLabel>
                <CardValue>
                  {c.type === "currency" ? formatCurrency(c.value) : <AnimatedCount target={c.value || 0} />}
                </CardValue>
                <CardSub>{c.sub}</CardSub>
              </Card>
            ))}
      </Grid>

      <SectionTitle>Leads Summary</SectionTitle>
      <Grid>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} $i={i}>
                <Skeleton $h="48px" $w="48px" style={{ borderRadius: 12 }} />
                <Skeleton $h="14px" $w="60%" />
                <Skeleton $h="36px" $w="40%" />
              </Card>
            ))
          : statCards(stats || {}).map((c, i) => (
              <Card key={c.label} $i={i}>
                <CardIcon $bg={c.bg} $color={c.color}>{c.icon}</CardIcon>
                <CardLabel>{c.label}</CardLabel>
                <CardValue><AnimatedCount target={c.value || 0} /></CardValue>
                <CardSub>{c.sub}</CardSub>
              </Card>
            ))}
      </Grid>

      <SectionTitle>Recent Leads</SectionTitle>
      <RecentTable>
        <Table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j}><Skeleton $h="16px" /></td>
                    ))}
                  </tr>
                ))
              : recent.length === 0
              ? <tr><td colSpan={5} style={{ textAlign: "center", color: "#33425e", padding: "32px" }}>No leads yet</td></tr>
              : recent.map((l) => (
                  <tr key={l._id}>
                    <td>{l.name}</td>
                    <td style={{ color: "#0254a0" }}>{l.email}</td>
                    <td>{l.subject}</td>
                    <td><StatusDot $s={l.status}>{l.status}</StatusDot></td>
                    <td style={{ color: "#33425e", fontSize: "0.8rem" }}>{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </RecentTable>
      </DesktopDashboard>
    </>
  );
}

const navGearIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.2.36.3.75.3 1.15V10.3A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/>
  </svg>
);
