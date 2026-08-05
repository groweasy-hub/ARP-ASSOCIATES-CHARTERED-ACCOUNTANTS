const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("arp_admin_token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const api = {
  post: (path, body) =>
    fetch(`${BASE}${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then((r) => r.json()),

  get: (path) =>
    fetch(`${BASE}${path}`, { headers: headers() }).then((r) => r.json()),

  patch: (path, body) =>
    fetch(`${BASE}${path}`, { method: "PATCH", headers: headers(), body: JSON.stringify(body) }).then((r) => r.json()),

  delete: (path) =>
    fetch(`${BASE}${path}`, { method: "DELETE", headers: headers() }).then((r) => r.json()),

  downloadCSV: (path) =>
    fetch(`${BASE}${path}`, { headers: headers() }).then(async (r) => {
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arp-leads-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }),
};

export default api;
