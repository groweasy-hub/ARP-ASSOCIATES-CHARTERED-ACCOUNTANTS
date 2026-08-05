import { useState } from "react";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const fadeUp = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  max-width: 760px;
`;

const Header = styled.div`
  margin-bottom: 22px;

  h2 {
    margin: 0 0 6px;
    color: #0d2244;
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

const Card = styled.form`
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(11, 31, 60, 0.07);
  padding: 26px;
  animation: ${fadeUp} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 22px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.08);

  svg {
    width: 22px;
    height: 22px;
    color: #0254a0;
  }

  h3 {
    margin: 0;
    color: #0d2244;
    font-size: 1rem;
    font-weight: 700;
  }

  span {
    display: block;
    margin-top: 3px;
    color: #33425e;
    font-size: 0.78rem;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
  color: #0d2244;
  font-size: 0.82rem;
  font-weight: 700;

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(13, 34, 68, 0.16);
    border-radius: 10px;
    padding: 12px 14px;
    color: #0d2244;
    font: inherit;
    font-weight: 500;
    background: #ffffff;
    outline: none;
    transition: border-color 160ms, box-shadow 160ms;
  }

  input:focus {
    border-color: #0254a0;
    box-shadow: 0 0 0 4px rgba(2, 84, 160, 0.12);
  }
`;

const Hint = styled.p`
  margin: 14px 0 0;
  color: #5f6f89;
  font-size: 0.78rem;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`;

const Button = styled.button`
  min-height: 42px;
  border: 0;
  border-radius: 10px;
  padding: 0 18px;
  background: linear-gradient(135deg, #2c649c, #0254a0);
  color: #ffffff;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms, box-shadow 160ms, opacity 160ms;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(2, 84, 160, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function Settings() {
  const { admin } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/auth/password", form);
      if (res.success) {
        toast.success("Password updated successfully");
        setForm(initialForm);
      } else {
        toast.error(res.message || "Unable to update password");
      }
    } catch {
      toast.error("Unable to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Header>
        <h2>Settings</h2>
        <p>Manage security settings for {admin?.email || "your admin account"}.</p>
      </Header>

      <Card onSubmit={handleSubmit}>
        <CardTitle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <div>
            <h3>Update Password</h3>
            <span>Use a strong password that is not shared with other accounts.</span>
          </div>
        </CardTitle>

        <FieldGrid>
          <Field>
            Current Password
            <input
              autoComplete="current-password"
              name="currentPassword"
              onChange={handleChange}
              placeholder="Enter current password"
              required
              type="password"
              value={form.currentPassword}
            />
          </Field>

          <Field>
            New Password
            <input
              autoComplete="new-password"
              minLength={8}
              name="newPassword"
              onChange={handleChange}
              placeholder="Enter new password"
              required
              type="password"
              value={form.newPassword}
            />
          </Field>

          <Field>
            Confirm New Password
            <input
              autoComplete="new-password"
              minLength={8}
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
              type="password"
              value={form.confirmPassword}
            />
          </Field>
        </FieldGrid>

        <Hint>Password must be at least 8 characters. You will continue to stay signed in after the update.</Hint>

        <Actions>
          <Button disabled={saving} type="submit">
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </Actions>
      </Card>
    </Page>
  );
}
