import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";

const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      circle at 50% 30%,
      rgba(2, 84, 160, 0.08) 0 20%,
      transparent 60%
    ),
    #f0f4f8;
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

  h1 {
    margin: 0 0 6px;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
  }
`;

const CardBody = styled.div`
  padding: 36px 40px;
`;

const Field = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 7px;
    color: #0d2244;
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  color: #26395d;
  font: inherit;
  font-size: 0.9rem;
  background: #f6fbff;
  border: 1.5px solid
    ${({ $error }) => ($error ? "#b42318" : "rgba(13,34,68,0.16)")};
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 150ms;

  &:focus {
    border-color: #0254a0;
    background: #fff;
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
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  margin: 12px 0 0;
  color: #b42318;
  font-size: 0.8rem;
  text-align: center;
`;

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
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
          <p>Admin Dashboard — Sign In</p>
        </CardTop>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Field>
              <label>Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>
            <Field>
              <label>Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Field>
            <SubmitBtn type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </SubmitBtn>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </form>
        </CardBody>
      </Card>
    </Page>
  );
}
