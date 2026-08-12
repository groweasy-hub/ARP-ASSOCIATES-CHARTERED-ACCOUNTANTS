import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 30%, rgba(2, 84, 160, 0.08) 0 20%, transparent 60%), #f0f4f8;
  font-family: Inter, "Segoe UI", sans-serif;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(11, 31, 60, 0.16);
  overflow: hidden;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1);
`;

const CardTop = styled.div`
  background: linear-gradient(135deg, #2c649c 0%, #0254a0 100%);
  padding: 36px 40px 32px;
  text-align: center;

  h1 { margin: 0 0 6px; color: #fff; font-size: 1.5rem; font-weight: 700; }
  p { margin: 0; color: rgba(255,255,255,.74); font-size: .875rem; }
`;

const CardBody = styled.div`padding: 36px 40px;`;

const Field = styled.div`
  margin-bottom: 18px;
  label { display: block; margin-bottom: 7px; color: #0d2244; font-size: .875rem; font-weight: 600; }
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
    password: "",
    remember: Boolean(localStorage.getItem("arp_remember_email")),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (forgotMode) {
      const res = await api.post("/auth/forgot-password", { email: form.email });
      setLoading(false);
      if (res.success) {
        toast.success(res.message || "Password reset request received");
        setForgotMode(false);
      } else {
        setError(res.message || "Unable to process reset request");
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
      <Card>
        <CardTop>
          <h1>ARP Associates</h1>
          <p>Chartered Accountants</p>
        </CardTop>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Field>
              <label>Email</label>
              <Input
                placeholder="Enter your email"
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </Field>
            <Field>
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <Input
                  disabled={forgotMode}
                  placeholder="Enter your password"
                  required={!forgotMode}
                  style={{ paddingRight: 58 }}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
                <ToggleBtn aria-label={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? "Hide" : "Show"}
                </ToggleBtn>
              </div>
            </Field>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#33425e", fontSize: ".85rem", marginBottom: 14 }}>
              <input checked={form.remember} type="checkbox" onChange={(event) => setForm({ ...form, remember: event.target.checked })} />
              Remember me
            </label>
            <SubmitBtn disabled={loading} type="submit">
              {loading ? (forgotMode ? "Sending..." : "Signing in...") : (forgotMode ? "Send Reset Link" : "Sign In")}
            </SubmitBtn>
            <TextBtn type="button" onClick={() => { setForgotMode((current) => !current); setError(""); }}>
              {forgotMode ? "Back to Sign In" : "Forgot Password?"}
            </TextBtn>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </form>
        </CardBody>
      </Card>
    </Page>
  );
}
