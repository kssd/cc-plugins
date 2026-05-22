import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [28, 45], [0, 1], {
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
        gap: 20,
        padding: "0 80px",
      }}
    >
      <div
        style={{
          opacity,
          fontSize: 46,
          fontWeight: 800,
          color: "#c9d1d9",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          letterSpacing: -0.5,
        }}
      >
        Get started
      </div>
      <div
        style={{
          opacity: subOpacity,
          fontSize: 18,
          color: "#8b949e",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          maxWidth: 560,
        }}
      >
        Install <span style={{ color: "#58a6ff" }}>scaffold</span> to bootstrap any repo.
        Install <span style={{ color: "#58a6ff" }}>sdd</span> to keep your spec and code in sync.
      </div>
      <div
        style={{
          opacity: ctaOpacity,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <code
          style={{
            backgroundColor: "#161b22",
            border: "1px solid #30363d",
            borderRadius: 6,
            padding: "8px 18px",
            fontSize: 15,
            color: "#3fb950",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          claude plugin marketplace add cc-plugins
        </code>
        <div
          style={{
            fontSize: 13,
            color: "#484f58",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          github.com/kssd/cc-plugins
        </div>
      </div>
    </AbsoluteFill>
  );
};
