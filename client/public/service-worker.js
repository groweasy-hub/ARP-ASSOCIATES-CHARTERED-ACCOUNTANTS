self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || "ARP Associates";
  const options = {
    body: payload.body || "You have a new admin notification.",
    icon: payload.icon || "/logo192.png",
    badge: payload.badge || "/logo192.png",
    tag: payload.tag || "arp-admin-notification",
    data: payload.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = event.notification.data?.url || "/admin/tasks";
  const targetUrl = new URL(rawUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin !== self.location.origin) continue;
        if ("navigate" in client) await client.navigate(targetUrl);
        return client.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
