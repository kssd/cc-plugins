import React from "react";
import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";
import { Terminal } from "../components/Terminal";
import { TASKS_LINES } from "../data/script";

export const TasksScene: React.FC = () => {
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
        headline="/sdd:tasks"
        sub="Decompose into a Wave-based task DAG with full REQ coverage"
        align="left"
      />
      <div style={{ maxWidth: 720 }}>
        <Terminal lines={TASKS_LINES} charsPerSecond={45} />
      </div>
    </AbsoluteFill>
  );
};
