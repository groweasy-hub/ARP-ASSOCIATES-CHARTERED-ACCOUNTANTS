import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api";

const Header = styled.div`margin-bottom:22px;h2{margin:0 0 6px;color:#0d2244;font-size:1.25rem}p{margin:0;color:#33425e;font-size:.9rem}`;
const TableWrap = styled.div`background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(11,31,60,.07);border:1px solid rgba(13,34,68,.07);overflow:auto`;
const Table = styled.table`width:100%;border-collapse:collapse;font-size:.875rem;th{padding:13px 16px;text-align:left;color:#33425e;font-size:.72rem;text-transform:uppercase;background:#f6fbff;border-bottom:1px solid rgba(13,34,68,.08);white-space:nowrap}td{padding:13px 16px;color:#0d2244;border-bottom:1px solid rgba(13,34,68,.06);vertical-align:top}tr:last-child td{border-bottom:0}`;
const Skeleton = styled.div`height:16px;border-radius:6px;background:linear-gradient(90deg,#f0f4f8 25%,#e8eef5 50%,#f0f4f8 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/audit-logs").then((res) => { if (res.success) setLogs(res.logs); }).finally(() => setLoading(false)); }, []);
  return <div><Header><h2>Audit Logs</h2><p>Track important account and system actions.</p></Header><TableWrap><Table><thead><tr><th>Date</th><th>User</th><th>Action</th><th>Module</th><th>Description</th><th>IP / Device</th></tr></thead><tbody>
    {loading ? Array.from({ length: 6 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((__, j) => <td key={j}><Skeleton /></td>)}</tr>) :
    logs.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 36, color: "#33425e" }}>No audit logs yet</td></tr> :
    logs.map((log) => <tr key={log._id}><td>{new Date(log.createdAt).toLocaleString("en-IN")}</td><td>{log.userEmail || "-"}</td><td style={{ fontWeight: 700 }}>{log.action}</td><td>{log.module}</td><td>{log.description}</td><td>{log.ip || "-"}<br /><span style={{ color: "#64748b", fontSize: ".75rem" }}>{log.userAgent || ""}</span></td></tr>)}
  </tbody></Table></TableWrap></div>;
}
