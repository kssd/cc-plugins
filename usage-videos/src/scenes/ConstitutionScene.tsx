import React from "react";
import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";
import { Terminal } from "../components/Terminal";
import { CONSTITUTION_LINES } from "../data/script";

export const ConstitutionScene: React.FC = () => {
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
        headline="/sdd:constitution"
        sub="Define non-negotiable principles — every plan must comply"
        align="left"
      />
      <div style={{ maxWidth: 720 }}>
        <Terminal lines={CONSTITUTION_LINES} charsPerSecond={45} />
      </div>
    </AbsoluteFill>
  );
};
