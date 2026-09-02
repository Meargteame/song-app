import styled from "@emotion/styled";

export const theme = {
  colors: {
    background: "#0f172a",
    cardBg: "#1e293b",
    cardBorder: "#334155",
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accent: "#38bdf8",
  },
};

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: ${theme.colors.textPrimary};
  min-height: 100vh;
`;

export const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease, transform 0.1s ease;

  background-color: ${({ variant }) =>
    variant === "danger"
      ? theme.colors.danger
      : variant === "secondary"
      ? theme.colors.cardBorder
      : theme.colors.primary};

  color: ${theme.colors.textPrimary};

  &:hover {
    background-color: ${({ variant }) =>
      variant === "danger"
        ? theme.colors.dangerHover
        : variant === "secondary"
        ? "#475569"
        : theme.colors.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;