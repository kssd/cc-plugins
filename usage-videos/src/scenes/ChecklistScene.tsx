import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { ChecklistRow } from "../components/ChecklistRow";
import { CHECKLIST_ROWS } from "../data/script";

export const ChecklistScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        padding: "40px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div style={{ opacity: titleOpacity }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#c9d1d9",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          /sdd:checklist
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#8b949e",
            fontFamily: '"Inter", sans-serif',
            marginTop: 4,
          }}
        >
          All checks pass — feature is release-ready
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 8,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {CHECKLIST_ROWS.map((label, i) => (
          <ChecklistRow key={label} label={label} delayFrames={i * 10 + 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
