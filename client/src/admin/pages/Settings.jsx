import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../permissions";

const fadeUp = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  max-width: 900px;

  @media (max-width: 768px) {
    max-width: none;
    display: grid;
    gap: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 16px;

  h2 {
    margin: 0 0 4px;
    color: #0d2244;
    font-size: 1.08rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: 0.78rem;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    gap: 4px;
    margin-bottom: 2px;

    h2 {
      margin: 0;
      color: #071e49;
      font-size: 1.18rem;
      font-weight: 800;
    }

    p {
      margin: 0;
      color: #33425e;
      font-size: 0.7rem;
      line-height: 1.45;
    }
  }
`;

const Card = styled.form`
  background: #ffffff;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(11, 31, 60, 0.06);
  padding: 18px;
  animation: ${fadeUp} 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 768px) {
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(11, 31, 60, 0.06);
    padding: 16px;
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.08);

  h3 {
    margin: 0;
    color: #0d2244;
    font-size: 0.9rem;
    font-weight: 700;
  }

  span {
    display: block;
    margin-top: 3px;
    color: #33425e;
    font-size: 0.7rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    display: grid;
    justify-items: center;
    gap: 10px;
    margin-bottom: 18px;
    padding: 18px 12px;
    border-radius: 14px;
    background: linear-gradient(180deg, #f6fbff 0%, #ffffff 100%);
    border: 1px solid rgba(13, 34, 68, 0.08);
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c649c, #0254a0);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    width: 82px;
    height: 82px;
    flex-basis: 82px;
    box-shadow: 0 10px 24px rgba(2, 84, 160, 0.16);
    font-size: 1.6rem;
  }
`;

const ProfileIdentity = styled.div`
  h3 {
    margin: 0 0 3px;
    color: #0d2244;
    font-size: 0.95rem;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: 0.76rem;
  }

  small {
    display: inline-flex;
    margin-top: 5px;
    padding: 3px 9px;
    border-radius: 999px;
    background: #ecfdf3;
    color: #087443;
    font-size: 0.68rem;
    font-weight: 800;
  }

  @media (max-width: 768px) {
    h3 {
      color: #071e49;
      font-size: 1rem;
      font-weight: 800;
    }

    p {
      font-size: 0.68rem;
    }

    small {
      font-size: 0.58rem;
    }
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

const Detail = styled.div`
  min-height: 52px;
  padding: 10px 12px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 8px;
  background: #f8fbff;

  label {
    display: block;
    margin-bottom: 4px;
    color: #5f6f89;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  span {
    color: #0d2244;
    font-size: 0.8rem;
    font-weight: 700;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    min-height: 0;
    padding: 8px;
    border-radius: 8px;
    background: #ffffff;

    label {
      margin-bottom: 3px;
      font-size: 0.5rem;
      letter-spacing: 0.02em;
    }

    span {
      font-size: 0.58rem;
      line-height: 1.28;
    }
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  color: #0d2244;
  font-size: 0.74rem;
  font-weight: 700;

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(13, 34, 68, 0.16);
    border-radius: 7px;
    padding: 9px 11px;
    color: #0d2244;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 500;
    background: #ffffff;
    outline: none;
    transition: border-color 160ms, box-shadow 160ms;
  }

  input:focus {
    border-color: #0254a0;
    box-shadow: 0 0 0 4px rgba(2, 84, 160, 0.12);
  }

  @media (max-width: 768px) {
    font-size: 0.64rem;

    input {
      border-radius: 9px;
      font-size: 0.7rem;
      padding: 10px 11px;
    }
  }
`;

const Hint = styled.p`
  margin: 12px 0 0;
  color: #5f6f89;
  font-size: 0.7rem;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 9px;
    margin-top: 16px;
  }
`;

const Button = styled.button`
  min-height: 36px;
  border: ${({ $secondary }) => ($secondary ? "1px solid rgba(13,34,68,.16)" : "0")};
  border-radius: 7px;
  padding: 0 14px;
  background: ${({ $secondary }) => ($secondary ? "#ffffff" : "linear-gradient(135deg, #2c649c, #0254a0)")};
  color: ${({ $secondary }) => ($secondary ? "#0d2244" : "#ffffff")};
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms, box-shadow 160ms, opacity 160ms;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(2, 84, 160, 0.14);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  @media (max-width: 768px) {
    min-height: 42px;
    border-radius: 10px;
    font-size: 0.72rem;
  }
`;

const initialForm = {
  email: "",
  phone: "",
  profileImage: "",
  password: "",
  confirmPassword: "",
  otp: "",
};

const displayValue = (value) => value || "-";

export default function Settings({ forcePasswordChange = false }) {
  const { admin, setAdmin } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(forcePasswordChange);
  const [otpStep, setOtpStep] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      email: admin?.email || "",
      phone: admin?.phone || "",
      profileImage: admin?.profileImage || "",
    }));
  }, [admin]);

  const resetEdit = () => {
    setEditing(false);
    setOtpStep(false);
    setForm({
      ...initialForm,
      email: admin?.email || "",
      phone: admin?.phone || "",
      profileImage: admin?.profileImage || "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, profileImage: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const validateEditableFields = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if ((form.password || form.confirmPassword) && form.password !== form.confirmPassword) {
      toast.error("Password and confirmation do not match");
      return false;
    }
    if (form.password && form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (forcePasswordChange && !form.password) {
      toast.error("Please set a new password");
      return false;
    }
    return true;
  };

  const requestOtp = async () => {
    if (!validateEditableFields()) return;
    setSendingOtp(true);
    try {
      const res = await api.post("/auth/profile/otp", {});
      if (res.success) {
        setOtpStep(true);
        toast.success(res.message || "OTP sent");
      } else {
        toast.error(res.message || "Unable to send OTP");
      }
    } catch {
      toast.error("Unable to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const saveWithOtp = async () => {
    if (!form.otp.trim()) {
      toast.error("Enter the OTP sent to your email");
      return;
    }
    if (!validateEditableFields()) return;

    setSaving(true);
    try {
      const res = await api.patch("/auth/profile", {
        email: form.email,
        phone: form.phone,
        profileImage: form.profileImage,
        password: form.password,
        confirmPassword: form.confirmPassword,
        otp: form.otp,
      });
      if (res.success) {
        toast.success(res.message || "Profile updated successfully");
        if (res.admin) setAdmin(res.admin);
        setEditing(false);
        setOtpStep(false);
        setForm((current) => ({ ...current, password: "", confirmPassword: "", otp: "" }));
      } else {
        toast.error(res.message || "Unable to update profile");
      }
    } catch {
      toast.error("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!editing) {
      setEditing(true);
      return;
    }
    if (otpStep) saveWithOtp();
    else requestOtp();
  };

  const avatarText = (admin?.name || admin?.email || "U").slice(0, 1).toUpperCase();
  const details = [
    ["Name", admin?.name],
    ["Email", admin?.email],
    ["Phone", admin?.phone],
    ["Employee ID", admin?.employeeId],
    ["Designation", admin?.designation],
    ["Department", admin?.department],
    ["Address", admin?.address],
    ["Date of Joining", admin?.dateOfJoining ? new Date(admin.dateOfJoining).toLocaleDateString("en-IN") : ""],
    ["Role", admin?.customRole?.name || roleLabel(admin?.role)],
    ["Status", admin?.status],
    ["Password Change Required", admin?.mustChangePassword ? "Yes" : "No"],
    ["Last Login", admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString("en-IN") : ""],
  ];

  return (
    <Page>
      <Header>
        <h2>{forcePasswordChange ? "Secure Your Account" : "Settings"}</h2>
        <p>
          {forcePasswordChange
            ? "Set your own password, then verify the OTP sent to your mail."
            : "View your employee details and update only your contact, password, and profile image."}
        </p>
      </Header>
      <MobileHeader>
        <h2>{forcePasswordChange ? "Secure Your Account" : "Profile Overview"}</h2>
        <p>
          {forcePasswordChange
            ? "Set your password and verify your account."
            : "Your employee profile and account details."}
        </p>
      </MobileHeader>

      <Card onSubmit={handleSubmit}>
        <CardTitle>
          <div>
            <h3>{editing ? "Update Profile" : "Employee Details"}</h3>
            <span>
              {editing
                ? otpStep
                  ? "Enter the OTP sent to your current email to save these changes."
                  : "Change mobile number, email, password, or profile image."
                : "Your complete employee profile details."}
            </span>
          </div>
        </CardTitle>

        <ProfileRow>
          <Avatar>
            {(editing ? form.profileImage : admin?.profileImage) ? (
              <img src={editing ? form.profileImage : admin.profileImage} alt={admin?.name || "Profile"} />
            ) : (
              avatarText
            )}
          </Avatar>
          <ProfileIdentity>
            <h3>{admin?.name || admin?.email}</h3>
            <p>{admin?.customRole?.name || roleLabel(admin?.role)}</p>
            <small>{admin?.status || "Active"}</small>
          </ProfileIdentity>
        </ProfileRow>

        {!editing ? (
          <DetailGrid>
            {details.map(([label, value]) => (
              <Detail key={label}>
                <label>{label}</label>
                <span>{displayValue(value)}</span>
              </Detail>
            ))}
          </DetailGrid>
        ) : (
          <>
            <FieldGrid>
              <Field>
                Profile Image
                <input accept="image/*" disabled={otpStep} type="file" onChange={handleImageUpload} />
              </Field>
              <Field>
                Mobile Number
                <input
                  autoComplete="tel"
                  disabled={otpStep}
                  name="phone"
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  type="tel"
                  value={form.phone}
                />
              </Field>
              <Field>
                Email
                <input
                  autoComplete="email"
                  disabled={otpStep}
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  type="email"
                  value={form.email}
                />
              </Field>
              <Field>
                New Password
                <input
                  autoComplete="new-password"
                  disabled={otpStep}
                  minLength={8}
                  name="password"
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  type="password"
                  value={form.password}
                />
              </Field>
              <Field>
                Confirm New Password
                <input
                  autoComplete="new-password"
                  disabled={otpStep}
                  minLength={8}
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  type="password"
                  value={form.confirmPassword}
                />
              </Field>
              {otpStep && (
                <Field>
                  OTP
                  <input
                    autoFocus
                    inputMode="numeric"
                    maxLength={6}
                    name="otp"
                    onChange={handleChange}
                    placeholder="Enter OTP from mail"
                    value={form.otp}
                  />
                </Field>
              )}
            </FieldGrid>
            <Hint>
              Clicking Update Changes sends an OTP to your current login email. The changes are saved only after OTP verification.
            </Hint>
          </>
        )}

        <Actions>
          {editing && !forcePasswordChange && (
            <Button $secondary disabled={saving || sendingOtp} type="button" onClick={resetEdit}>
              Cancel
            </Button>
          )}
          {otpStep && (
            <Button $secondary disabled={saving || sendingOtp} type="button" onClick={requestOtp}>
              {sendingOtp ? "Sending..." : "Resend OTP"}
            </Button>
          )}
          <Button disabled={saving || sendingOtp} type="submit">
            {!editing
              ? "Update Profile"
              : otpStep
                ? saving
                  ? "Updating..."
                  : "Verify OTP & Save"
                : sendingOtp
                  ? "Sending OTP..."
                  : "Update Changes"}
          </Button>
        </Actions>
      </Card>
    </Page>
  );
}
