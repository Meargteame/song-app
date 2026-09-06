import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1800;
  padding: 1rem;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Dialog = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${theme.shadows.popover};
  animation: slideUp 0.15s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DialogBody = styled.div`
  padding: 1.5rem;
`;

const DialogTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const DialogMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  background: ${theme.colors.surface};
  border-radius: 0 0 12px 12px;
`;

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogMessage>{message}</DialogMessage>
        </DialogBody>
        <DialogActions>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={variant} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
};
