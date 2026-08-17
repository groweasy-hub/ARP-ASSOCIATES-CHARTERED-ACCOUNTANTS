import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  enableTaskPushNotifications,
  getPushStatus,
  getPushSupport,
  isCurrentDevicePushEnabled,
} from "../services/pushNotifications";

const Card = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px;
  padding: 12px 14px;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 10px;
    margin: 0 0 12px;
    padding: 10px 11px;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.pill};

  svg {
    width: 17px;
    height: 17px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 28px;
    height: 28px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const Copy = styled.div`
  min-width: 0;

  h3 {
    margin: 0 0 3px;
    font-size: 0.86rem;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.74rem;
    line-height: 1.35;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h3 {
      font-size: 0.72rem;
    }

    p {
      font-size: 0.62rem;
    }
  }
`;

const Button = styled.button`
  min-height: 34px;
  padding: 0 13px;
  color: #ffffff;
  background: ${({ theme }) => theme.colors.primary};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.button};
  font: inherit;
  font-size: 0.74rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: 1 / -1;
    justify-self: stretch;
    min-height: 30px;
    padding: 0 10px;
    font-size: 0.64rem;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

const bellIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function EnableNotifications() {
  const [state, setState] = useState({
    loading: true,
    supported: true,
    configured: false,
    enabled: false,
    permission: "default",
    message: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const support = getPushSupport();
      if (!support.supported) {
        if (mounted) {
          setState({
            loading: false,
            supported: false,
            configured: false,
            enabled: false,
            permission: support.permission,
            message: "Task push notifications are not supported in this browser.",
          });
        }
        return;
      }

      try {
        const [status, enabledOnDevice] = await Promise.all([
          getPushStatus(),
          isCurrentDevicePushEnabled(),
        ]);
        if (!mounted) return;
        setState({
          loading: false,
          supported: true,
          configured: Boolean(status.configured),
          enabled: enabledOnDevice,
          permission: Notification.permission,
          message: "",
        });
      } catch {
        if (mounted) {
          setState((current) => ({ ...current, loading: false, message: "Unable to check notification status." }));
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEnable = async () => {
    setSaving(true);
    const result = await enableTaskPushNotifications();
    setSaving(false);

    if (result.success) {
      setState((current) => ({ ...current, enabled: true, permission: "granted", message: "" }));
      return;
    }

    const message =
      result.reason === "denied"
        ? "Notifications are blocked. Enable them from your browser or site settings."
        : result.reason === "not-configured"
          ? "Push notifications are not configured on the server yet."
          : "Unable to enable task notifications on this device.";
    setState((current) => ({ ...current, permission: Notification.permission, message }));
  };

  if (state.loading || state.enabled) return null;

  return (
    <Card>
      <Icon aria-hidden="true">{bellIcon}</Icon>
      <Copy>
        <h3>Enable Task Notifications</h3>
        <p>
          {state.message ||
            "Get notified instantly when a new task is assigned to you, even when ARP Admin is closed."}
        </p>
      </Copy>
      {state.supported && state.configured && state.permission !== "denied" && (
        <Button type="button" onClick={handleEnable} disabled={saving}>
          {saving ? "Enabling..." : "Enable Notifications"}
        </Button>
      )}
    </Card>
  );
}
