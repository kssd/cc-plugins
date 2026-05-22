import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type TerminalProps = {
  lines: string[];
  charsPerSecond?: number;
  fps?: number;
};

const PAUSE_FRAMES = 8;

function getVisibleContent(
  lines: string[],
  frame: number,
  charsPerFrame: number,
): { visibleLines: string[]; cursorLine: number; cursorCol: number } {
  let totalCharsRevealed = Math.floor(frame * charsPerFrame);
  const visibleLines: string[] = [];
  let cursorLine = 0;
  let cursorCol = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLen = line.length + PAUSE_FRAMES;

    if (totalCharsRevealed <= 0) break;

    if (totalCharsRevealed >= lineLen) {
      visibleLines.push(line);
      totalCharsRevealed -= lineLen;
      cursorLine = i + 1;
      cursorCol = 0;
    } else {
      const chars = Math.min(totalCharsRevealed, line.length);
      visibleLines.push(line.slice(0, chars));
      cursorLine = i;
      cursorCol = chars;
      break;
    }
  }

  return { visibleLines, cursorLine, cursorCol };
}

function lineColor(line: string): string {
  if (line.startsWith("$")) return "#c9d1d9";
  if (line.includes("✓")) return "#3fb950";
  if (line.startsWith("  P") || line.includes("PASS")) return "#3fb950";
  if (line.startsWith("?")) return "#58a6ff";
  if (line.startsWith("  ✓")) return "#3fb950";
  if (line.startsWith("Next:")) return "#d29922";
  if (line.startsWith("#")) return "#8b949e";
  return "#8b949e";
}

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  charsPerSecond = 40,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const charsPerFrame = charsPerSecond / fps;

  const { visibleLines, cursorLine, cursorCol } = getVisibleContent(
    lines,
    frame,
    charsPerFrame,
  );

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        opacity,
        backgroundColor: "#161b22",
        borderRadius: 8,
        border: "1px solid #30363d",
        overflow: "hidden",
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        fontSize: 14,
        lineHeight: 1.6,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        width: "100%",
      }}
    >
      {/* window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          backgroundColor: "#21262d",
          borderBottom: "1px solid #30363d",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <span style={{ marginLeft: 8, color: "#8b949e", fontSize: 12 }}>
          terminal
        </span>
      </div>
      {/* content */}
      <div style={{ padding: "12px 16px", minHeight: 80 }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ color: lineColor(line), whiteSpace: "pre" }}>
            {line}
            {i === cursorLine && cursorCol === line.length && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: "1em",
                  backgroundColor: "#58a6ff",
                  verticalAlign: "text-bottom",
                  marginLeft: 1,
                }}
              />
            )}
          </div>
        ))}
        {visibleLines.length === lines.length && cursorVisible && (
          <div style={{ color: "#c9d1d9" }}>
            <span>$ </span>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: "1em",
                backgroundColor: "#58a6ff",
                verticalAlign: "text-bottom",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
