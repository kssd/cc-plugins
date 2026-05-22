import React from "react";
import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";
import { Terminal } from "../components/Terminal";
import { PLAN_LINES } from "../data/script";

export const PlanScene: React.FC = () => {
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
      <TextOverlay
        headline="/sdd:plan"
        sub="Generate technical blueprint — gated by constitution"
        align="left"
      />
      <div style={{ maxWidth: 720 }}>
        <Terminal lines={PLAN_LINES} charsPerSecond={45} />
      </div>
    </AbsoluteFill>
  );
};
