import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import api from "../api";

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(11,31,60,0.07);
  border: 1px solid rgba(13,34,68,0.07);
  animation: ${fadeUp} 0.4s cubic-bezier(0.22,1,0.36,1) both;
  animation-delay: ${({ $i }) => $i * 80}ms;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardIcon = styled.div`
  width: 48px; height: 48px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || "#eaf3fb"};
  display: flex; align-items: center; justify-content: center;
  color: ${({ $color }) => $color || "#0254a0"};
  svg { width: 22px; height: 22px; }
`;

const CardLabel = styled.p`margin: 0; color: #33425e; font-size: 0.8rem; font-weight: 500;`;
const CardValue = styled.h2`margin: 0; color: #0d2244; font-size: 2rem; font-weight: 700; letter-spacing: -0.03em;`;
const CardSub = styled.p`margin: 0; color: #33425e; font-size: 0.75rem;`;

const SectionTitle = styled.h3`
  margin: 0 0 16px;
  color: #0d2244;
  font-size: 1rem;
  font-weight: 700;
`;

const RecentTable = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(11,31,60,0.07);
  border: 1px solid rgba(13,34,68,0.07);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  th { padding: 14px 18px; text-align: left; color: #33425e; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; background: #f6fbff; border-bottom: 1px solid rgba(13,34,68,0.08); }
  td { padding: 14px 18px; color: #0d2244; border-bottom: 1px solid rgba(13,34,68,0.06); }
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
  padding: 3px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 600;
  background: ${({ $s }) => ({ New: "#eaf3fb", Contacted: "#ecfdf3", "Follow Up": "#fffbeb", Closed: "#f3f4f6" }[$s] || "#f3f4f6")};
  color: ${({ $s }) => ({ New: "#0254a0", Contacted: "#087443", "Follow Up": "#b45309", Closed: "#374151" }[$s] || "#374151")};
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

const statCards = (s) => [
  { label: "Total Leads", value: s.total, sub: "All time", bg: "#eaf3fb", color: "#0254a0", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: "New Leads Today", value: s.today, sub: "Since midnight", bg: "#ecfdf3", color: "#087443", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: "Total Messages", value: s.messages, sub: "Contact form", bg: "#f0f4ff", color: "#4f46e5", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: "Pending Leads", value: s.pending, sub: "New + Follow Up", bg: "#fffbeb", color: "#b45309", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { label: "Contacted", value: s.contacted, sub: "Leads contacted", bg: "#f0fdf4", color: "#15803d", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/leads/stats"), api.get("/leads?limit=5&sort=newest")])
      .then(([s, l]) => {
        if (s.success) setStats(s.stats);
        if (l.success) setRecent(l.leads);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
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
    </div>
  );
}
