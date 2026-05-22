import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [12, 24], [0, 1], {
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
        gap: 16,
      }}
    >
      <div style={{ opacity }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#c9d1d9",
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          Dev Onboarding
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#58a6ff",
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            textAlign: "center",
            marginTop: 8,
          }}
        >
          SDD + Scaffold — Claude Code Plugins
        </div>
      </div>
      <div
        style={{
          opacity: badgeOpacity,
          display: "flex",
          gap: 12,
          marginTop: 8,
        }}
      >
        {["scaffold@0.1.1", "sdd@0.1.0"].map((pkg) => (
          <span
            key={pkg}
            style={{
              padding: "4px 12px",
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: 20,
              fontSize: 13,
              color: "#3fb950",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {pkg}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
