import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "../styles";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Card = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${theme.shadows.card};
  min-height: 240px;
`;

const Bone = styled.div<{ width?: string; height?: string; radius?: string }>`
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "14px"};
  border-radius: ${({ radius }) => radius || "4px"};
  background: linear-gradient(
    90deg,
    ${theme.colors.surface} 25%,
    ${theme.colors.surfaceHover} 37%,
    ${theme.colors.surface} 63%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const DetailBox = styled.div`
  padding: 0.75rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  padding-top: 0.85rem;
  margin-top: auto;
`;

export const SkeletonCard: React.FC = () => (
  <Card>
    <div>
      <Row style={{ marginBottom: "0.5rem" }}>
        <div style={{ flex: 1 }}>
          <Bone width="70%" height="18px" />
          <Bone width="45%" height="13px" style={{ marginTop: "0.4rem" }} />
        </div>
        <Bone width="20px" height="20px" radius="50%" />
      </Row>

      <DetailBox>
        <Row>
          <Bone width="35%" height="11px" />
          <Bone width="50%" height="11px" />
        </Row>
        <Row>
          <Bone width="30%" height="11px" />
          <Bone width="40%" height="11px" />
        </Row>
      </DetailBox>

      <Bone width="55px" height="22px" radius="4px" />
    </div>

    <ActionRow>
      <Bone height="30px" radius="6px" />
      <Bone height="30px" radius="6px" />
      <Bone height="30px" radius="6px" />
    </ActionRow>
  </Card>
);

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);
