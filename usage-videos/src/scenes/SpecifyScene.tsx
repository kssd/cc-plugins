import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Terminal } from "../components/Terminal";
import { SpecPanel } from "../components/SpecPanel";
import type { SpecLine } from "../data/script";

type SpecifySceneProps = {
  featureNum: 1 | 2;
  terminalLines: string[];
  specLines: SpecLine[];
  subtitle: string;
};

export const SpecifyScene: React.FC<SpecifySceneProps> = ({
  featureNum,
  terminalLines,
  specLines,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // SpecPanel slides in after terminal has shown the first 3 lines (~40 frames)
  const panelStartFrame = 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        padding: "40px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div style={{ opacity: titleOpacity }}>
        <div
          style={{
            fontSize: 13,
            color: "#58a6ff",
            fontFamily: '"JetBrains Mono", monospace',
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          Feature {featureNum}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#c9d1d9",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          /sdd:specify
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#8b949e",
            fontFamily: '"Inter", sans-serif',
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <Terminal lines={terminalLines} charsPerSecond={40} />
        </div>
        <div style={{ flex: 1 }}>
          <SpecPanel
            title="spec.md"
            lines={specLines}
            startFrame={panelStartFrame}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
