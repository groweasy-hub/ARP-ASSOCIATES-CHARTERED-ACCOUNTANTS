import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../api";

const Header = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:16px;h2{margin:0 0 4px;color:#0d2244;font-size:1.08rem}p{margin:0;color:#33425e;font-size:.78rem}@media(max-width:640px){display:grid}`;
const List = styled.div`display:grid;gap:9px`;
const Item = styled.div`background:#fff;border:1px solid ${({$read})=>$read?"rgba(13,34,68,.07)":"rgba(2,84,160,.22)"};border-radius:10px;box-shadow:0 2px 10px rgba(11,31,60,.06);padding:12px 14px`;
const ItemBody = styled.button`min-width:0;text-align:left;background:transparent;border:0;padding:0;font:inherit;cursor:pointer;h3{margin:0 0 4px;color:#0d2244;font-size:.84rem}p{margin:0;color:#33425e;font-size:.76rem;line-height:1.45}span{display:block;margin-top:6px;color:#64748b;font-size:.68rem}`;
const ClearAllBtn = styled.button`min-height:34px;padding:0 14px;border-radius:8px;border:1px solid rgba(13,34,68,.14);background:#fff;color:#0254a0;font:inherit;font-size:.74rem;font-weight:800;white-space:nowrap;cursor:pointer;transition:background 150ms,border-color 150ms;&:hover{background:#eaf3fb;border-color:rgba(2,84,160,.28)}&:disabled{opacity:.6;cursor:not-allowed}@media(max-width:640px){width:100%}`;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [clearingAll, setClearingAll] = useState(false);
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
  const clearAll = async () => {
    if (notifications.length === 0) return;
    setClearingAll(true);
    const res = await api.delete("/notifications");
    if (res.success) {
      setNotifications([]);
    } else {
      load();
    }
    setClearingAll(false);
  };
  return <div><Header><div><h2>Notifications</h2><p>Recent task, notice, invoice, payment, and account alerts.</p></div><ClearAllBtn disabled={clearingAll || notifications.length === 0} onClick={clearAll}>{clearingAll ? "Clearing..." : "Clear All"}</ClearAllBtn></Header><List>
    {notifications.length === 0 ? <Item as="div" $read><h3>No notifications</h3><p>New alerts will appear here.</p></Item> :
    notifications.map((item) => (
      <Item key={item._id} $read={item.isRead}>
        <ItemBody onClick={() => markRead(item)}>
          <h3>{item.title}</h3>
          <p>{item.message}</p>
          <span>{new Date(item.createdAt).toLocaleString("en-IN")}</span>
        </ItemBody>
      </Item>
    ))}
  </List></div>;
}
