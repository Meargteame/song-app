import styled from "@emotion/styled";

export const theme = {
  colors: {
    background: "#09090b",
    surface: "#121215",
    cardBg: "#141417",
    cardBgHover: "#18181c",
    cardBorder: "#27272a",
    cardBorderHover: "#3f3f46",
    
    // Solid crisp primary & secondary
    primary: "#f4f4f5",
    primaryText: "#09090b",
    primaryHover: "#ffffff",
    
    secondary: "#1f1f23",
    secondaryBorder: "#2e2e33",
    secondaryText: "#e4e4e7",
    secondaryHover: "#27272a",
    
    danger: "#ef4444",
    dangerBg: "rgba(239, 68, 68, 0.1)",
    dangerBorder: "rgba(239, 68, 68, 0.25)",
    dangerHover: "#dc2626",
    
    success: "#22c55e",
    successBg: "rgba(34, 197, 94, 0.1)",
    
    textPrimary: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    
    tagBg: "#1c1c21",
    tagBorder: "#2d2d34",
    tagText: "#d4d4d8",
  },
  shadows: {
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
    popover: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
  },
};

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  color: ${theme.colors.textPrimary};
  min-height: 100vh;
  box-sizing: border-box;
`;

export const Button = styled.button<{
  variant?: "primary" | "danger" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: ${({ size }) =>
    size === "sm" ? "0.35rem 0.75rem" : size === "lg" ? "0.75rem 1.5rem" : "0.55rem 1.1rem"};
  font-size: ${({ size }) => (size === "sm" ? "0.8rem" : size === "lg" ? "0.95rem" : "0.875rem")};
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;

  background: ${({ variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.dangerBg
      : variant === "outline"
      ? "transparent"
      : theme.colors.secondary};

  color: ${({ variant }) =>
    variant === "primary"
      ? theme.colors.primaryText
      : variant === "danger"
      ? theme.colors.danger
      : theme.colors.secondaryText};

  border-color: ${({ variant }) =>
    variant === "danger"
      ? theme.colors.dangerBorder
      : variant === "outline"
      ? theme.colors.cardBorder
      : variant === "secondary"
      ? theme.colors.secondaryBorder
      : "transparent"};

  &:hover {
    background: ${({ variant }) =>
      variant === "primary"
        ? theme.colors.primaryHover
        : variant === "danger"
        ? theme.colors.danger
        : variant === "outline"
        ? theme.colors.secondary
        : theme.colors.secondaryHover};

    color: ${({ variant }) =>
      variant === "danger"
        ? "#ffffff"
        : variant === "primary"
        ? theme.colors.primaryText
        : theme.colors.textPrimary};

    border-color: ${({ variant }) =>
      variant === "primary"
        ? "transparent"
        : variant === "danger"
        ? theme.colors.danger
        : theme.colors.cardBorderHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;