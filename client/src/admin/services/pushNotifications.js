import api from "../api";

const SERVICE_WORKER_URL = "/service-worker.js";
const SERVICE_WORKER_ACTIVE_TIMEOUT_MS = 10000;
const API_ROOT = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const getPushSupport = () => ({
  supported:
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    window.isSecureContext,
  permission: typeof Notification === "undefined" ? "unsupported" : Notification.permission,
});

export const getPushStatus = () => api.get("/push/status");

const getRegistration = async () => {
  const existing = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
  if (existing) return existing;
  return navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: "/" });
};

const waitForActiveRegistration = async (registration) => {
  if (registration.active) return registration;

  const worker = registration.installing || registration.waiting;
  const workerActivated = worker
    ? new Promise((resolve) => {
        worker.addEventListener(
          "statechange",
          () => {
            if (worker.state === "activated") resolve();
          },
          { once: false }
        );
      })
    : Promise.resolve();

  const timeout = new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error("Service worker activation timed out.")), SERVICE_WORKER_ACTIVE_TIMEOUT_MS);
  });

  await Promise.race([navigator.serviceWorker.ready, workerActivated, timeout]);
  const readyRegistration = await navigator.serviceWorker.ready;
  return readyRegistration.active ? readyRegistration : registration;
};

export const enableTaskPushNotifications = async () => {
  const support = getPushSupport();
  if (!support.supported) {
    return { success: false, reason: "unsupported" };
  }

  const status = await getPushStatus();
  if (!status.success || !status.configured || !status.publicKey) {
    return { success: false, reason: "not-configured" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { success: false, reason: permission };
  }

  const registration = await waitForActiveRegistration(await getRegistration());
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(status.publicKey),
    }));

  const response = await api.post("/push/subscribe", {
    ...subscription.toJSON(),
    deviceName: navigator.platform || "Browser",
  });

  return response.success ? { success: true } : { success: false, reason: "server" };
};

export const isCurrentDevicePushEnabled = async () => {
  const support = getPushSupport();
  if (!support.supported) return false;
  const registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
  const subscription = await registration?.pushManager.getSubscription();
  return Boolean(subscription);
};

export const disableTaskPushNotifications = async () => {
  const support = getPushSupport();
  if (!support.supported) return;

  const registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  try {
    await fetch(`${BASE}/push/unsubscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("arp_admin_token") || ""}`,
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
  } finally {
    await subscription.unsubscribe();
  }
};
