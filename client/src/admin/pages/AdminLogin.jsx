import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import brand from "../../data/brand.json";

const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image:
    linear-gradient(180deg, rgba(246, 251, 255, 0.28), rgba(237, 245, 255, 0.08)),
    url("/login-bg-mobile.png"),
    url("/images/login-bg-mobile.png");
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #edf5ff;
  font-family: Inter, "Segoe UI", sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  padding: 28px 18px 88px;

  @media (min-width: 1025px) {
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    padding: clamp(24px, 3.5vw, 52px);
    background-image:
      linear-gradient(90deg, rgba(246, 251, 255, 0.5), rgba(246, 251, 255, 0.08)),
      url("/login-bg-desktop.png"),
      url("/images/login-bg-desktop.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #edf5ff;
  }
`;

const DesktopStage = styled.div`
  width: min(1120px, 100%);
  display: grid;
  align-items: center;
  grid-template-columns: minmax(310px, 0.9fr) minmax(390px, 470px);
  gap: clamp(32px, 5.4vw, 76px);

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 34px;
    width: min(100%, 380px);
  }
`;

const MobileBrand = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-width: 0;

    img {
      width: 64px;
      height: 64px;
      object-fit: contain;
      filter: drop-shadow(0 14px 24px rgba(2, 84, 160, 0.15));
    }

    h1 {
      margin: 0 0 5px;
      color: #08265f;
      font-size: clamp(1.62rem, 6.8vw, 2.18rem);
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0;
    }

    p {
      margin: 0;
      color: #526280;
      font-size: clamp(0.92rem, 3.35vw, 1.22rem);
      line-height: 1;
    }
  }

  @media (max-width: 380px) {
    gap: 11px;

    img {
      width: 50px;
      height: 50px;
    }
  }
`;

const BrandPanel = styled.section`
  color: #08265f;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const BrandLockup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 30px;

  img {
    width: 62px;
    height: 62px;
    object-fit: contain;
    filter: drop-shadow(0 16px 28px rgba(2, 84, 160, 0.16));
  }
`;

const BrandCopy = styled.div`
  h1 {
    margin: 0 0 7px;
    color: #08265f;
    font-size: clamp(1.55rem, 2.15vw, 2.08rem);
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #4b5b7b;
    font-size: clamp(0.9rem, 1.08vw, 1.04rem);
  }
`;

const AccentLine = styled.div`
  width: 54px;
  height: 3px;
  border-radius: 999px;
  background: #075fe0;
  margin: 0 0 22px 4px;
`;

const IntroTitle = styled.h2`
  margin: 0 0 18px;
  color: #08265f;
  font-size: clamp(1.28rem, 1.65vw, 1.62rem);
  line-height: 1.12;
  font-weight: 800;
`;

const IntroText = styled.p`
  max-width: 340px;
  margin: 0;
  color: #435373;
  font-size: clamp(0.86rem, 1vw, 0.98rem);
  line-height: 1.55;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(11, 31, 60, 0.16);
  overflow: hidden;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 1024px) {
    width: min(100%, 342px);
    max-width: calc(100vw - 36px);
    justify-self: center;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 28px 70px rgba(11, 31, 60, 0.12);
    backdrop-filter: blur(16px);
  }

  @media (min-width: 1025px) {
    max-width: 470px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.82);
    box-shadow: 0 32px 90px rgba(11, 31, 60, 0.14);
    backdrop-filter: blur(18px);
  }
`;

const CardTop = styled.div`
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  padding: 36px 40px 32px;
  text-align: center;

  h1 { margin: 0 0 6px; color: #fff; font-size: 1.5rem; font-weight: 700; }
  p { margin: 0; color: rgba(255,255,255,.74); font-size: .875rem; }

  @media (max-width: 1024px) {
    background: transparent;
    padding: 28px 22px 8px;

    h1 {
      margin: 10px 0 7px;
      color: #061f55;
      font-size: 1.26rem;
      line-height: 1.08;
      font-weight: 800;
    }

    p {
      color: #2f80ff;
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
  }

  @media (min-width: 1025px) {
    background: transparent;
    padding: 28px 38px 12px;

    h1 {
      margin: 8px 0 0;
      color: #061f55;
      font-size: 1.3rem;
      line-height: 1.15;
      font-weight: 800;
    }

    p {
      color: #2f80ff;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }
  }
`;

const MobileSubtitle = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    margin: 0;
    color: #526280;
    font-size: 0.8rem;
    line-height: 1.35;
  }
`;

const DesktopOnly = styled.span`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileOnly = styled.span`
  display: none;

  @media (max-width: 1024px) {
    display: inline;
  }
`;

const ShieldMark = styled.div`
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(2, 84, 160, 0.08), rgba(2, 84, 160, 0.18));
  box-shadow: inset 0 0 0 12px rgba(2, 84, 160, 0.08);

  span {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #ffffff;
    background: linear-gradient(135deg, #2f80ff, #0254a0);
    box-shadow: 0 12px 24px rgba(2, 84, 160, 0.24);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 1024px) {
    width: 58px;
    height: 58px;
    margin: 0 auto 12px;
    box-shadow: inset 0 0 0 9px rgba(2, 84, 160, 0.08);

    span {
      width: 36px;
      height: 36px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (min-width: 1025px) {
    width: 66px;
    height: 66px;
    display: grid;
    place-items: center;
    margin: 0 auto 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(2, 84, 160, 0.08), rgba(2, 84, 160, 0.18));
    box-shadow: inset 0 0 0 10px rgba(2, 84, 160, 0.08);

    span {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #ffffff;
      background: linear-gradient(135deg, #2f80ff, #0254a0);
      box-shadow: 0 12px 24px rgba(2, 84, 160, 0.24);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CardBody = styled.div`
  padding: 36px 40px;

  @media (max-width: 1024px) {
    padding: 6px 20px 24px;
  }

  @media (min-width: 1025px) {
    padding: 14px 38px 28px;
  }
`;

const Field = styled.div`
  margin-bottom: 18px;
  label { display: block; margin-bottom: 7px; color: #0d2244; font-size: .875rem; font-weight: 600; }

  @media (max-width: 1024px) {
    margin-bottom: 14px;

    label {
      margin-bottom: 7px;
      color: #061f55;
      font-size: 0.74rem;
      font-weight: 800;
    }
  }

  @media (min-width: 1025px) {
    margin-bottom: 15px;

    label {
      margin-bottom: 8px;
      color: #061f55;
      font-size: 0.86rem;
      font-weight: 700;
    }
  }
`;

const InputWrap = styled.div`
  position: relative;
`;

const FieldIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  z-index: 1;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  color: #0254a0;
  transform: translateY(-50%);

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 1025px) {
    position: absolute;
    left: 16px;
    top: 50%;
    z-index: 1;
    display: grid;
    width: 18px;
    height: 18px;
    place-items: center;
    color: #0254a0;
    transform: translateY(-50%);

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  color: #26395d;
  font: inherit;
  font-size: .9rem;
  background: #f6fbff;
  border: 1.5px solid rgba(13,34,68,.16);
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 150ms;
  &:focus { border-color: #0254a0; background: #fff; }
  &:disabled { opacity: .65; }

  @media (max-width: 1024px) {
    height: 44px;
    padding: 0 14px 0 ${({ $icon }) => ($icon ? "44px" : "14px")};
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.8);
    border: 1.5px solid rgba(9, 35, 84, 0.14);
    color: #061f55;
    font-size: 0.78rem;
    box-shadow: 0 10px 28px rgba(11, 31, 60, 0.04);

    &::placeholder {
      color: #7b8aa5;
    }
  }

  @media (min-width: 1025px) {
    height: 48px;
    padding: 0 16px 0 ${({ $icon }) => ($icon ? "52px" : "16px")};
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.78);
    border: 1.5px solid rgba(9, 35, 84, 0.15);
    color: #061f55;
    font-size: 0.88rem;
    box-shadow: 0 10px 28px rgba(11, 31, 60, 0.04);

    &::placeholder {
      color: #7b8aa5;
    }
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 8px;
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 200ms;
  &:hover:not(:disabled) { opacity: .9; }
  &:disabled { opacity: .6; cursor: not-allowed; }

  @media (max-width: 1024px) {
    height: 46px;
    margin-top: 4px;
    border-radius: 10px;
    font-size: 0.9rem;
    box-shadow: 0 18px 34px rgba(2, 84, 160, 0.24);
  }

  @media (min-width: 1025px) {
    height: 50px;
    margin-top: 8px;
    border-radius: 10px;
    font-size: 0.95rem;
    box-shadow: 0 18px 34px rgba(2, 84, 160, 0.24);
  }
`;

const TextBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  border: 0;
  background: transparent;
  color: #0254a0;
  font: inherit;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: auto;
    margin: 0;
    color: #005bd7;
    font-size: 0.76rem;
  }

  @media (min-width: 1025px) {
    width: auto;
    margin: 0;
    color: #005bd7;
    font-size: 0.84rem;
  }
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  border: 0;
  background: transparent;
  color: #33425e;
  cursor: pointer;
  font: inherit;
  font-size: .78rem;
  font-weight: 700;

  @media (max-width: 1024px) {
    right: 12px;
    top: 50%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #061f55;
    font-size: 0.76rem;
    transform: translateY(-50%);
  }

  @media (min-width: 1025px) {
    right: 14px;
    top: 50%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #061f55;
    font-size: 0.84rem;
    transform: translateY(-50%);
  }
`;

const RememberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #33425e;
  font-size: .85rem;
  margin-bottom: 14px;

  @media (max-width: 1024px) {
    justify-content: space-between;
    gap: 10px;
    margin: 0 0 18px;
    font-size: 0.76rem;
  }

  @media (min-width: 1025px) {
    justify-content: space-between;
    gap: 14px;
    margin: -2px 0 18px;
    font-size: 0.84rem;
  }
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  input {
    width: 15px;
    height: 15px;
    margin: 0;
    accent-color: #0254a0;
  }

  @media (max-width: 1024px) {
    input {
      width: 15px;
      height: 15px;
    }
  }
`;

const SecureNote = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  margin-top: 30px;
  color: #405273;
  font-size: 0.84rem;
  text-align: center;

  i {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #edf5ff;
    color: #0254a0;
    font-style: normal;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 1025px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 22px;
    color: #405273;
    font-size: 0.82rem;

    i {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #edf5ff;
      color: #0254a0;
      font-style: normal;
    }

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const SecureTitle = styled.strong`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    color: #061f55;
    font-size: 0.78rem;
    font-weight: 700;
  }
`;

const SecureText = styled.span`
  display: block;
`;

const ErrorMsg = styled.p`
  margin: 12px 0 0;
  color: #b42318;
  font-size: .8rem;
  text-align: center;
`;

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: localStorage.getItem("arp_remember_email") || "",
    newEmail: "",
    password: "",
    confirmPassword: "",
    otp: "",
    remember: Boolean(localStorage.getItem("arp_remember_email")),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (forgotMode) {
      if (!otpSent) {
        const res = await api.post("/auth/forgot-password", { email: form.email });
        setLoading(false);
        if (res.success) {
          setOtpSent(true);
          toast.success(res.message || "OTP sent to your mail");
        } else {
          setError(res.message || "Unable to send OTP");
        }
        return;
      }

      if (form.password !== form.confirmPassword) {
        setLoading(false);
        setError("Password and confirmation do not match");
        return;
      }

      const res = await api.post("/auth/reset-password", {
        email: form.email,
        newEmail: form.newEmail,
        otp: form.otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setLoading(false);
      if (res.success) {
        toast.success(res.message || "Password updated successfully");
        setForgotMode(false);
        setOtpSent(false);
        setForm((current) => ({ ...current, password: "", confirmPassword: "", otp: "", newEmail: "" }));
      } else {
        setError(res.message || "Unable to reset password");
      }
      return;
    }

    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      if (form.remember) localStorage.setItem("arp_remember_email", form.email);
      else localStorage.removeItem("arp_remember_email");
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } else {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <Page>
      <DesktopStage>
        <MobileBrand>
          <img src={brand.logoPath} alt={`${brand.name} logo`} />
          <div>
            <h1>ARP Associates</h1>
            <p>Chartered Accountants</p>
          </div>
        </MobileBrand>
        <BrandPanel>
          <BrandLockup>
            <img src={brand.logoPath} alt={`${brand.name} logo`} />
            <BrandCopy>
              <h1>ARP Associates</h1>
              <p>Chartered Accountants</p>
            </BrandCopy>
          </BrandLockup>
          <AccentLine />
          <IntroTitle>Secure Admin Access</IntroTitle>
          <IntroText>
            Welcome back! Please sign in to access your admin dashboard and manage your organization with ease.
          </IntroText>
        </BrandPanel>
        <Card>
        <CardTop>
          <ShieldMark aria-hidden="true">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10 11V9a2 2 0 0 1 4 0v2"/></svg>
            </span>
          </ShieldMark>
          <p>Admin Portal</p>
          <h1>
            {forgotMode ? (
              otpSent ? "Reset your password" : "Verify your email"
            ) : (
              <>
                <DesktopOnly>Sign in to your account</DesktopOnly>
                <MobileOnly>Welcome Back</MobileOnly>
              </>
            )}
          </h1>
          {!forgotMode && <MobileSubtitle>Sign in to access your admin dashboard</MobileSubtitle>}
        </CardTop>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Field>
              <label>{forgotMode ? "Email" : "Email or Employee ID"}</label>
              <InputWrap>
                <FieldIcon aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </FieldIcon>
              <Input
                $icon
                placeholder={forgotMode ? "Enter your email" : "Enter email or employee ID"}
                required
                type={forgotMode ? "email" : "text"}
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              </InputWrap>
            </Field>
            <Field>
              <label>{forgotMode ? "New Password" : "Password"}</label>
              <InputWrap>
                <FieldIcon aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                </FieldIcon>
                <Input
                  $icon
                  disabled={forgotMode && !otpSent}
                  minLength={forgotMode ? 8 : undefined}
                  placeholder={forgotMode ? "Enter new password" : "Enter your password"}
                  required={!forgotMode || otpSent}
                  style={{ paddingRight: 76 }}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
                <ToggleBtn aria-label={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword((current) => !current)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                  {showPassword ? "Hide" : "Show"}
                </ToggleBtn>
              </InputWrap>
            </Field>
            {forgotMode && otpSent && (
              <>
                <Field>
                  <label>Confirm New Password</label>
                  <Input
                    placeholder="Re-enter new password"
                    required
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                  />
                </Field>
                <Field>
                  <label>OTP</label>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP from mail"
                    required
                    value={form.otp}
                    onChange={(event) => setForm({ ...form, otp: event.target.value })}
                  />
                </Field>
                <Field>
                  <label>New Email</label>
                  <Input
                    placeholder="Optional email change"
                    type="email"
                    value={form.newEmail}
                    onChange={(event) => setForm({ ...form, newEmail: event.target.value })}
                  />
                </Field>
              </>
            )}
            <RememberRow>
              <CheckLabel>
                <input checked={form.remember} type="checkbox" onChange={(event) => setForm({ ...form, remember: event.target.checked })} />
                Remember me
              </CheckLabel>
              {!forgotMode && (
                <TextBtn type="button" onClick={() => { setForgotMode(true); setOtpSent(false); setError(""); }}>
                  Forgot Password?
                </TextBtn>
              )}
            </RememberRow>
            <SubmitBtn disabled={loading} type="submit">
              {loading
                ? (forgotMode ? "Processing..." : "Signing in...")
                : (forgotMode ? (otpSent ? "Reset Password" : "Send OTP") : "Sign In")}
            </SubmitBtn>
            {forgotMode && (
              <TextBtn type="button" onClick={() => { setForgotMode(false); setOtpSent(false); setError(""); }}>
                Back to Sign In
              </TextBtn>
            )}
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <SecureNote>
              <i>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </i>
              <div>
                <SecureTitle>Secure admin access</SecureTitle>
                <SecureText>Your information is secure and encrypted</SecureText>
              </div>
            </SecureNote>
          </form>
        </CardBody>
      </Card>
      </DesktopStage>
    </Page>
  );
}

