import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeAuthModal, setCredentials, setAuthLoading, setAuthError } from "../store/slices/authSlice";
import { login, register } from "../api/authApi";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalCard = styled.div`
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  position: relative;
  color: #ffffff;
`;

const Header = styled.div`
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #ffffff;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #a7a7a7;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TabContainer = styled.div`
  display: flex;
  padding: 0.5rem 1.5rem 0 1.5rem;
  gap: 0.5rem;
  background: #121212;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${({ active }) => (active ? "rgba(29, 185, 84, 0.15)" : "transparent")};
  color: ${({ active }) => (active ? "#1ed760" : "#a7a7a7")};
  border: 1px solid ${({ active }) => (active ? "rgba(29, 185, 84, 0.4)" : "transparent")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ active }) => (active ? "#1ed760" : "#ffffff")};
    background: ${({ active }) => (active ? "rgba(29, 185, 84, 0.2)" : "rgba(255, 255, 255, 0.05)")};
  }
`;

const Body = styled.div`
  padding: 1.5rem;
`;

const QuickDemoBox = styled.div`
  margin-bottom: 1.25rem;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 10px;
`;

const QuickDemoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #a7a7a7;
  margin-bottom: 0.5rem;
`;

const QuickButtonsRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DemoBtn = styled.button<{ roleType: "admin" | "user" }>`
  flex: 1;
  padding: 0.55rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s;
  background: ${({ roleType }) => (roleType === "admin" ? "rgba(234, 179, 8, 0.15)" : "rgba(59, 130, 246, 0.15)")};
  color: ${({ roleType }) => (roleType === "admin" ? "#facc15" : "#60a5fa")};
  border: 1px solid ${({ roleType }) => (roleType === "admin" ? "rgba(234, 179, 8, 0.3)" : "rgba(59, 130, 246, 0.3)")};

  &:hover {
    background: ${({ roleType }) => (roleType === "admin" ? "rgba(234, 179, 8, 0.25)" : "rgba(59, 130, 246, 0.25)")};
    transform: translateY(-1px);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #b3b3b3;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 0.75rem;
    color: #6a6a6a;
    width: 16px;
    height: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.75rem 0.65rem 2.4rem;
  background: #181818;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1ed760;
  }

  &::placeholder {
    color: #535353;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.65rem 0.75rem 0.65rem 2.4rem;
  background: #181818;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;

  &:focus {
    border-color: #1ed760;
  }
`;

const Option = styled.option`
  background: #181818;
  color: #ffffff;
`;

const ErrorMsg = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-size: 0.82rem;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 0.95rem;
  border-radius: 24px;
  font-weight: 700;
  background: #1ed760;
  color: #000000;

  &:hover {
    background: #1fdf64;
    transform: scale(1.02);
  }
`;

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authModalOpen, authModalTab, loading, error } = useAppSelector((state) => state.auth);

  const [tab, setTab] = useState<"login" | "signup">(authModalTab || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  React.useEffect(() => {
    if (authModalOpen) {
      setTab(authModalTab);
    }
  }, [authModalOpen, authModalTab]);

  if (!authModalOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));
    try {
      const res = await login(demoEmail, demoPass);
      dispatch(setCredentials({ user: res.user, token: res.token }));
    } catch (err: any) {
      dispatch(setAuthError(err.response?.data?.message || "Failed to log in with demo account"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      if (tab === "login") {
        const res = await login(email, password);
        dispatch(setCredentials({ user: res.user, token: res.token }));
      } else {
        if (!name.trim()) {
          dispatch(setAuthError("Name is required"));
          return;
        }
        const res = await register(name, email, password, role);
        dispatch(setCredentials({ user: res.user, token: res.token }));
      }
    } catch (err: any) {
      dispatch(setAuthError(err.response?.data?.message || "Authentication failed. Please check credentials."));
    }
  };

  return (
    <Backdrop onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1ed760" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {tab === "login" ? "Log in to AuraTune" : "Create AuraTune Account"}
          </Title>
          <CloseBtn onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </CloseBtn>
        </Header>

        <TabContainer>
          <TabButton active={tab === "login"} onClick={() => setTab("login")}>
            Log In
          </TabButton>
          <TabButton active={tab === "signup"} onClick={() => setTab("signup")}>
            Sign Up
          </TabButton>
        </TabContainer>

        <Body>
          <QuickDemoBox>
            <QuickDemoLabel>⚡ Quick Demo Auto-Login</QuickDemoLabel>
            <QuickButtonsRow>
              <DemoBtn
                type="button"
                roleType="admin"
                onClick={() => handleQuickLogin("admin@auratune.com", "admin123")}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Admin Demo
              </DemoBtn>
              <DemoBtn
                type="button"
                roleType="user"
                onClick={() => handleQuickLogin("demo@auratune.com", "user123")}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
                Listener Demo
              </DemoBtn>
            </QuickButtonsRow>
          </QuickDemoBox>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <FormGroup>
                <Label>Full Name</Label>
                <InputWrapper>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <Input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </InputWrapper>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Email Address</Label>
              <InputWrapper>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <InputWrapper>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            {tab === "signup" && (
              <FormGroup>
                <Label>Account Role</Label>
                <InputWrapper>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "user" | "admin")}
                  >
                    <Option value="user">Listener (Standard User)</Option>
                    <Option value="admin">Admin (Manage & Upload Songs)</Option>
                  </Select>
                </InputWrapper>
              </FormGroup>
            )}

            <SubmitButton type="submit" variant="primary" disabled={loading}>
              {loading
                ? "Processing..."
                : tab === "login"
                ? "Log In"
                : "Create Account"}
            </SubmitButton>
          </Form>
        </Body>
      </ModalCard>
    </Backdrop>
  );
};
