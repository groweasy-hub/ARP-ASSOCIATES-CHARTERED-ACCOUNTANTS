import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../api";

const Header = styled.div`margin-bottom:16px;h2{margin:0 0 4px;color:#0d2244;font-size:1.08rem}p{margin:0;color:#33425e;font-size:.78rem}`;
const List = styled.div`display:grid;gap:9px`;
const Item = styled.div`display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;background:#fff;border:1px solid ${({$read})=>$read?"rgba(13,34,68,.07)":"rgba(2,84,160,.22)"};border-radius:10px;box-shadow:0 2px 10px rgba(11,31,60,.06);padding:12px 14px;@media(max-width:640px){grid-template-columns:1fr;gap:10px}`;
const ItemBody = styled.button`min-width:0;text-align:left;background:transparent;border:0;padding:0;font:inherit;cursor:pointer;h3{margin:0 0 4px;color:#0d2244;font-size:.84rem}p{margin:0;color:#33425e;font-size:.76rem;line-height:1.45}span{display:block;margin-top:6px;color:#64748b;font-size:.68rem}`;
const ClearBtn = styled.button`min-height:32px;padding:0 12px;border-radius:8px;border:1px solid rgba(13,34,68,.14);background:#fff;color:#0254a0;font:inherit;font-size:.72rem;font-weight:800;cursor:pointer;transition:background 150ms,color 150ms,border-color 150ms;&:hover{background:#eaf3fb;border-color:rgba(2,84,160,.28)}&:disabled{opacity:.6;cursor:not-allowed}@media(max-width:640px){width:100%}`;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [clearingId, setClearingId] = useState("");
  const navigate = useNavigate();
  const load = async () => { const res = await api.get("/notifications"); if (res.success) setNotifications(res.notifications); };
  useEffect(() => { load(); }, []);
  const targetUrl = (item) => {
    if (item.url) return item.url;
    if (item.task) {
      const taskId = item.task?._id || item.task;
      const employeeId = item.assignedTo?._id || item.assignedTo || item.user?._id || item.user || "all";
      return `/admin/tasks?filter=assigned&employee=${encodeURIComponent(employeeId)}&task=${encodeURIComponent(taskId)}`;
    }
    if (String(item.type || "").startsWith("task")) return "/admin/tasks?filter=assigned";
    return "";
  };
  const markRead = async (item) => {
    if (!item.isRead) await api.patch(`/notifications/${item._id}/read`, {});
    const url = targetUrl(item);
    if (url) navigate(url);
    else load();
  };
  const clearNotification = async (item) => {
    setClearingId(item._id);
    const res = await api.patch(`/notifications/${item._id}/read`, {});
    if (res.success) {
      setNotifications((current) => current.filter((entry) => entry._id !== item._id));
    } else {
      load();
    }
    setClearingId("");
  };
  return <div><Header><h2>Notifications</h2><p>Recent task, notice, invoice, payment, and account alerts.</p></Header><List>
    {notifications.length === 0 ? <Item as="div" $read><h3>No notifications</h3><p>New alerts will appear here.</p></Item> :
    notifications.map((item) => (
      <Item key={item._id} $read={item.isRead}>
        <ItemBody onClick={() => markRead(item)}>
          <h3>{item.title}</h3>
          <p>{item.message}</p>
          <span>{new Date(item.createdAt).toLocaleString("en-IN")}</span>
        </ItemBody>
        <ClearBtn disabled={clearingId === item._id} onClick={() => clearNotification(item)}>
          {clearingId === item._id ? "Clearing..." : "Clear"}
        </ClearBtn>
      </Item>
    ))}
  </List></div>;
}
