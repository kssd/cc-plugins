import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { WorkflowDiagram } from "../components/WorkflowDiagram";

export const SddWorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const diagramOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 60px",
      }}
    >
      <div style={{ opacity: titleOpacity, textAlign: "center" }}>
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#c9d1d9",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          SDD Workflow
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#8b949e",
            fontFamily: '"Inter", sans-serif',
            marginTop: 8,
          }}
        >
          Spec is the source of truth — every artifact traces back to a requirement
        </div>
      </div>
      <div style={{ opacity: diagramOpacity, width: "100%" }}>
        <WorkflowDiagram />
      </div>
    </AbsoluteFill>
  );
};
