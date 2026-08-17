import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../api";
import { roleLabel } from "../permissions";

const Header = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:16px;h2{margin:0;color:#0d2244;font-size:1.08rem}p{margin:3px 0 0;color:#33425e;font-size:.8rem}`;
const Avatar = styled.div`width:46px;height:46px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#2c649c,#0254a0);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;img{width:100%;height:100%;object-fit:cover;display:block}`;
const Card = styled.div`background:#fff;border-radius:10px;border:1px solid rgba(13,34,68,.07);box-shadow:0 2px 10px rgba(11,31,60,.06);padding:18px`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;@media(max-width:700px){grid-template-columns:1fr}`;
const Item = styled.div`label{display:block;color:#33425e;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700;margin-bottom:4px}span{color:#0d2244;font-size:.84rem;font-weight:700;word-break:break-word}`;
const Skeleton = styled.div`height:18px;border-radius:6px;background:linear-gradient(90deg,#f0f4f8 25%,#e8eef5 50%,#f0f4f8 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;

export default function UserProfile() {
  const { id } = useParams();
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
        <Avatar>
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name || "Employee"} />
          ) : (
            (user.name || user.email || "U").slice(0, 1).toUpperCase()
          )}
        </Avatar>
        <div><h2>{user.name}</h2><p>{user.customRole?.name || roleLabel(user.role)} | {user.email}</p></div>
      </Header>
      <Card>
        <Grid>
          {[
            ["Name", user.name], ["Email", user.email], ["Phone", user.phone || "-"],
            ["Employee ID", user.employeeId || "-"], ["Designation", user.designation || "-"],
            ["Department", user.department || "-"], ["Address", user.address || "-"],
            ["Date of Joining", user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString("en-IN") : "-"],
            ["Role", user.customRole?.name || roleLabel(user.role)], ["Status", user.status],
            ["Password Change Required", user.mustChangePassword ? "Yes" : "No"],
            ["Created Date", new Date(user.createdAt).toLocaleDateString("en-IN")],
            ["Last Login", user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN") : "Never"],
          ].map(([label, value]) => <Item key={label}><label>{label}</label><span>{value}</span></Item>)}
        </Grid>
      </Card>
    </div>
  );
}
