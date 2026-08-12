import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api";

const Header = styled.div`margin-bottom:22px;h2{margin:0 0 6px;color:#0d2244;font-size:1.25rem}p{margin:0;color:#33425e;font-size:.9rem}`;
const List = styled.div`display:grid;gap:12px`;
const Item = styled.button`text-align:left;background:#fff;border:1px solid ${({$read})=>$read?"rgba(13,34,68,.07)":"rgba(2,84,160,.22)"};border-radius:12px;box-shadow:0 2px 12px rgba(11,31,60,.06);padding:16px 18px;font:inherit;cursor:pointer;h3{margin:0 0 5px;color:#0d2244;font-size:.95rem}p{margin:0;color:#33425e;font-size:.85rem;line-height:1.5}span{display:block;margin-top:8px;color:#64748b;font-size:.75rem}`;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const load = async () => { const res = await api.get("/notifications"); if (res.success) setNotifications(res.notifications); };
  useEffect(() => { load(); }, []);
  const markRead = async (item) => { if (!item.isRead) { await api.patch(`/notifications/${item._id}/read`, {}); load(); } };
  return <div><Header><h2>Notifications</h2><p>Recent task, notice, invoice, payment, and account alerts.</p></Header><List>
    {notifications.length === 0 ? <Item as="div" $read><h3>No notifications</h3><p>New alerts will appear here.</p></Item> :
    notifications.map((item) => <Item key={item._id} $read={item.isRead} onClick={() => markRead(item)}><h3>{item.title}</h3><p>{item.message}</p><span>{new Date(item.createdAt).toLocaleString("en-IN")}</span></Item>)}
  </List></div>;
}
