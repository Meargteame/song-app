import styled from "@emotion/styled";

export const theme = {
  colors: {
    // Deep sleek dark canvas
    background: "#070709",
    backgroundSecondary: "#0c0c10",
    surface: "#111116",
    surfaceHover: "#17171e",
    
    // Cards & Glassmorphism
    cardBg: "rgba(18, 18, 24, 0.75)",
    cardBgHover: "rgba(25, 25, 34, 0.9)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    cardBorderHover: "rgba(139, 92, 246, 0.35)", // Subtle violet glow
    
    // Brand Gradients & Accents
    primaryGradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    primaryGradientHover: "linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #db2777 100%)",
    cyanGradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    emeraldGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    
    primary: "#f4f4f5",
    primaryText: "#09090b",
    primaryHover: "#ffffff",
    
    accentViolet: "#8b5cf6",
    accentCyan: "#06b6d4",
    accentRose: "#f43f5e",
    accentEmerald: "#10b981",
    
    secondary: "rgba(255, 255, 255, 0.05)",
    secondaryBorder: "rgba(255, 255, 255, 0.1)",
    secondaryText: "#e4e4e7",
    secondaryHover: "rgba(255, 255, 255, 0.09)",
    
    danger: "#f87171",
    dangerBg: "rgba(239, 68, 68, 0.12)",
    dangerBorder: "rgba(239, 68, 68, 0.25)",
    dangerHover: "#ef4444",
    
    success: "#4ade80",
    successBg: "rgba(34, 197, 94, 0.12)",
    
    textPrimary: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    
    tagBg: "rgba(255, 255, 255, 0.04)",
    tagBorder: "rgba(255, 255, 255, 0.08)",
    tagText: "#d4d4d8",
  },
  shadows: {
    card: "0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    cardHover: "0 10px 30px -4px rgba(139, 92, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    popover: "0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    glow: "0 0 25px -5px rgba(139, 92, 246, 0.4)",
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
};

export const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: ${theme.fonts.body};
  color: ${theme.colors.textPrimary};
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
`;

export const Button = styled.button<{
  variant?: "primary" | "gradient" | "danger" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: ${({ size }) =>
    size === "sm" ? "0.38rem 0.8rem" : size === "lg" ? "0.75rem 1.5rem" : "0.55rem 1.15rem"};
  font-size: ${({ size }) => (size === "sm" ? "0.8rem" : size === "lg" ? "0.95rem" : "0.875rem")};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: ${theme.fonts.body};
  backdrop-filter: blur(8px);

  background: ${({ variant }) =>
    variant === "gradient"
      ? theme.colors.primaryGradient
      : variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.dangerBg
      : variant === "outline" || variant === "ghost"
      ? "transparent"
      : theme.colors.secondary};

  color: ${({ variant }) =>
    variant === "gradient"
      ? "#ffffff"
      : variant === "primary"
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

  box-shadow: ${({ variant }) =>
    variant === "gradient" ? "0 4px 15px -2px rgba(168, 85, 247, 0.35)" : "none"};

  &:hover {
    background: ${({ variant }) =>
      variant === "gradient"
        ? theme.colors.primaryGradientHover
        : variant === "primary"
        ? theme.colors.primaryHover
        : variant === "danger"
        ? theme.colors.danger
        : variant === "outline" || variant === "ghost"
        ? "rgba(255, 255, 255, 0.08)"
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
        : "rgba(255, 255, 255, 0.15)"};

    transform: translateY(-1px);
    box-shadow: ${({ variant }) =>
      variant === "gradient" ? "0 6px 20px -2px rgba(168, 85, 247, 0.5)" : "0 2px 8px rgba(0,0,0,0.3)"};
  }

  &:active {
    transform: scale(0.97) translateY(0);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;