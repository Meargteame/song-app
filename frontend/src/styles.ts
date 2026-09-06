import styled from "@emotion/styled";

export const theme = {
  colors: {
    // Dynamic CSS theme variables
    background: "var(--bg-app)",
    surface: "var(--bg-surface)",
    surfaceHover: "var(--bg-surface-hover)",
    cardBg: "var(--bg-card)",
    cardBgHover: "var(--bg-card-hover)",
    cardBorder: "var(--border-subtle)",
    cardBorderHover: "var(--border-strong)",
    
    primary: "var(--btn-primary-bg)",
    primaryText: "var(--btn-primary-text)",
    primaryHover: "var(--btn-primary-hover)",
    
    secondary: "var(--btn-secondary-bg)",
    secondaryBorder: "var(--border-subtle)",
    secondaryText: "var(--text-secondary)",
    secondaryHover: "var(--btn-secondary-hover)",
    
    danger: "var(--color-danger)",
    dangerBg: "var(--color-danger-bg)",
    dangerBorder: "var(--color-danger-border)",
    dangerHover: "var(--color-danger-hover)",
    
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textMuted: "var(--text-muted)",
    
    tagBg: "var(--tag-bg)",
    tagBorder: "var(--tag-border)",
    tagText: "var(--tag-text)",
    inputBg: "var(--bg-input)",
  },
  shadows: {
    card: "var(--shadow-card)",
    cardHover: "var(--shadow-card-hover)",
    popover: "var(--shadow-popover)",
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