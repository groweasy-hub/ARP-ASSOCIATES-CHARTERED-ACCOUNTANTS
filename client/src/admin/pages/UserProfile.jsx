import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../api";
import { roleLabel } from "../permissions";

const Header = styled.div`display:flex;align-items:center;gap:16px;margin-bottom:22px;h2{margin:0;color:#0d2244;font-size:1.25rem}p{margin:4px 0 0;color:#33425e;font-size:.9rem}`;
const Avatar = styled.div`width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#2c649c,#0254a0);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800`;
const Tabs = styled.div`display:flex;gap:8px;overflow:auto;margin-bottom:16px`;
const Tab = styled.button`padding:10px 14px;border-radius:8px;border:1px solid ${({$active})=>$active?"#0254a0":"rgba(13,34,68,.12)"};background:${({$active})=>$active?"#eaf3fb":"#fff"};color:#0d2244;font:inherit;font-size:.84rem;font-weight:700;cursor:pointer;white-space:nowrap`;
const Card = styled.div`background:#fff;border-radius:14px;border:1px solid rgba(13,34,68,.07);box-shadow:0 2px 12px rgba(11,31,60,.07);padding:24px`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;@media(max-width:700px){grid-template-columns:1fr}`;
const Item = styled.div`label{display:block;color:#33425e;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700;margin-bottom:5px}span{color:#0d2244;font-weight:700;word-break:break-word}`;
const ChipWrap = styled.div`display:flex;gap:8px;flex-wrap:wrap`;
const Chip = styled.span`display:inline-flex;padding:5px 9px;border-radius:999px;background:#f6fbff;color:#0254a0;font-size:.75rem;font-weight:700`;
const Skeleton = styled.div`height:18px;border-radius:6px;background:linear-gradient(90deg,#f0f4f8 25%,#e8eef5 50%,#f0f4f8 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;

const tabs = ["Profile", "Security", "Permissions", "Assigned Clients", "Assigned Tasks", "Activity"];

export default function UserProfile() {
  const { id } = useParams();
  const [active, setActive] = useState("Profile");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => { if (res.success) setData(res); }).finally(() => setLoading(false));
  }, [id]);

  const user = data?.user;

  if (loading) return <Card><Skeleton /><br /><Skeleton /><br /><Skeleton /></Card>;
  if (!user) return <Card>User not found.</Card>;

  return (
    <div>
      <Header>
        <Avatar>{user.name?.[0] || "U"}</Avatar>
        <div><h2>{user.name}</h2><p>{user.customRole?.name || roleLabel(user.role)} | {user.email}</p></div>
      </Header>
      <Tabs>{tabs.map((tab) => <Tab key={tab} $active={active === tab} onClick={() => setActive(tab)}>{tab}</Tab>)}</Tabs>
      <Card>
        {active === "Profile" && (
          <Grid>
            {[
              ["Name", user.name], ["Email", user.email], ["Phone", user.phone || "-"],
              ["Employee ID", user.employeeId || "-"], ["Department", user.department || "-"],
              ["Role", user.customRole?.name || roleLabel(user.role)], ["Status", user.status],
              ["Created Date", new Date(user.createdAt).toLocaleDateString("en-IN")],
              ["Last Login", user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN") : "Never"],
            ].map(([label, value]) => <Item key={label}><label>{label}</label><span>{value}</span></Item>)}
          </Grid>
        )}
        {active === "Security" && <p style={{ margin: 0, color: "#33425e" }}>Password resets are managed from Team Management. Passwords are never returned by the API.</p>}
        {active === "Permissions" && <ChipWrap>{user.permissions.map((permission) => <Chip key={permission}>{permission}</Chip>)}</ChipWrap>}
        {active === "Assigned Clients" && <p style={{ margin: 0, color: "#33425e" }}>Assigned client records will appear here when Client Management is added.</p>}
        {active === "Assigned Tasks" && <p style={{ margin: 0, color: "#33425e" }}>Assigned task records will appear here when Tasks are added.</p>}
        {active === "Activity" && <p style={{ margin: 0, color: "#33425e" }}>User activity will appear here as modules record audit events.</p>}
      </Card>
    </div>
  );
}
