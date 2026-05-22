import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Terminal } from "../components/Terminal";
import { TextOverlay } from "../components/TextOverlay";
import { IMPLEMENT_LINES, IMPLEMENT_CODE } from "../data/script";

function CodePanel({ code, startFrame }: { code: string; startFrame: number }) {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slideX = interpolate(localFrame, [0, 20], [60, 0], {
    extrapolateRight: "clamp",
  });

  const lines = code.split("\n");

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slideX}px)`,
        backgroundColor: "#161b22",
        borderRadius: 8,
        border: "1px solid #30363d",
        overflow: "hidden",
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 13,
        lineHeight: 1.7,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
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
        src/tasks/create.ts
      </div>
      <div style={{ padding: "12px 16px" }}>
        {lines.map((line, i) => {
          const isReq = line.includes("REQ:");
          const isComment = line.trimStart().startsWith("//");
          const isKeyword =
            line.includes("export") ||
            line.includes("function") ||
            line.includes("const") ||
            line.includes("return");

          let color = "#c9d1d9";
          if (isReq) color = "#3fb950";
          else if (isComment) color = "#484f58";
          else if (isKeyword) color = "#ff7b72";

          const lineDelay = i * 6;
          const lineOpacity = interpolate(
            localFrame,
            [lineDelay, lineDelay + 10],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                color,
                opacity: lineOpacity,
                whiteSpace: "pre",
                minHeight: "1.7em",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ImplementScene: React.FC = () => {
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
      <TextOverlay
        headline="/sdd:implement T001"
        sub="Code annotated with REQ: comments — every requirement traced"
        align="left"
      />
      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        <div style={{ flex: "0 0 340px" }}>
          <Terminal lines={IMPLEMENT_LINES} charsPerSecond={40} />
        </div>
        <div style={{ flex: 1 }}>
          <CodePanel code={IMPLEMENT_CODE} startFrame={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
