import styled from "@emotion/styled";

export const theme = {
  colors: {
    // Professional clean dark canvas (Linear/Vercel style)
    background: "#09090b",
    surface: "#121215",
    surfaceHover: "#18181c",
    cardBg: "#141417",
    cardBgHover: "#19191d",
    cardBorder: "#27272a",
    cardBorderHover: "#3f3f46",
    
    // Crisp monochrome primary
    primary: "#ffffff",
    primaryText: "#09090b",
    primaryHover: "#f4f4f5",
    
    secondary: "#18181b",
    secondaryBorder: "#27272a",
    secondaryText: "#e4e4e7",
    secondaryHover: "#27272a",
    
    danger: "#ef4444",
    dangerBg: "rgba(239, 68, 68, 0.1)",
    dangerBorder: "rgba(239, 68, 68, 0.25)",
    dangerHover: "#dc2626",
    
    textPrimary: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    
    tagBg: "#1c1c21",
    tagBorder: "#2d2d34",
    tagText: "#d4d4d8",
  },
  shadows: {
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
    cardHover: "0 4px 12px 0 rgba(0, 0, 0, 0.5)",
    popover: "0 10px 30px -10px rgba(0, 0, 0, 0.8)",
  },
  fonts: {
    heading: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  font-family: ${theme.fonts.body};
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
    size === "sm" ? "0.35rem 0.75rem" : size === "lg" ? "0.75rem 1.5rem" : "0.55rem 1.15rem"};
  font-size: ${({ size }) => (size === "sm" ? "0.8rem" : size === "lg" ? "0.95rem" : "0.875rem")};
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  font-family: ${theme.fonts.body};

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
        ? theme.colors.secondaryHover
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
        : variant === "outline"
        ? theme.colors.cardBorderHover
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