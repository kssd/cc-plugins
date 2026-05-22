import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { SpecLine } from "../data/script";

type SpecPanelProps = {
  title: string;
  lines: SpecLine[];
  startFrame?: number;
};

const LINE_STAGGER = 4;

function lineStyle(kind: SpecLine["kind"]): React.CSSProperties {
  switch (kind) {
    case "req":
      return { color: "#58a6ff", fontWeight: 600 };
    case "ac":
      return { color: "#c9d1d9" };
    case "code":
      return { color: "#3fb950" };
    case "muted":
      return { color: "#484f58", fontStyle: "italic" };
    default:
      return { color: "#c9d1d9" };
  }
}

export const SpecPanel: React.FC<SpecPanelProps> = ({
  title,
  lines,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  const slideX = interpolate(localFrame, [0, 20], [60, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${slideX}px)`,
        opacity,
        backgroundColor: "#161b22",
        borderRadius: 8,
        border: "1px solid #30363d",
        overflow: "hidden",
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 13,
        lineHeight: 1.7,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "8px 14px",
          backgroundColor: "#21262d",
          borderBottom: "1px solid #30363d",
          color: "#8b949e",
          fontSize: 12,
        }}
      >
        {title}
      </div>
      <div style={{ padding: "12px 16px" }}>
        {lines.map((line, i) => {
          const lineFrame = i * LINE_STAGGER;
          const lineOpacity = interpolate(
            localFrame,
            [lineFrame, lineFrame + 8],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
          );
          return (
            <div
              key={i}
              style={{
                ...lineStyle(line.kind),
                opacity: lineOpacity,
                whiteSpace: "pre",
                minHeight: line.text === "" ? "1em" : undefined,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
