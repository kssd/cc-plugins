import React from "react";
import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";
import { Terminal } from "../components/Terminal";
import { SCAFFOLD_LINES } from "../data/script";

export const ScaffoldScene: React.FC = () => {
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
        headline="/scaffold:init"
        sub="Scaffold task-tracker — Node/TypeScript + CI"
        align="left"
      />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Terminal lines={SCAFFOLD_LINES} charsPerSecond={35} />
      </div>
    </AbsoluteFill>
  );
};
