import React from "react";
import { useCurrentFrame, spring } from "remotion";

const NODES = [
  "constitution",
  "specify",
  "clarify",
  "plan",
  "tasks",
  "implement",
  "sync",
];

const NODE_DELAY = 15;
const NODE_W = 112;
const NODE_H = 36;
const GAP = 20;
const TOTAL_W = NODES.length * NODE_W + (NODES.length - 1) * GAP;
const SVG_H = 80;

export const WorkflowDiagram: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      viewBox={`0 0 ${TOTAL_W} ${SVG_H}`}
      style={{ width: "100%", overflow: "visible" }}
    >
      {NODES.map((label, i) => {
        const x = i * (NODE_W + GAP);
        const cy = SVG_H / 2;
        const nodeFrame = Math.max(0, frame - i * NODE_DELAY);

        const scale = spring({
          frame: nodeFrame,
          fps: 30,
          config: { damping: 200, stiffness: 80 },
        });
        const scaleClamped = Math.min(scale, 1);

        const isActive = frame >= i * NODE_DELAY;
        const fillColor = isActive ? "#58a6ff" : "#161b22";
        const strokeColor = isActive ? "#58a6ff" : "#30363d";
        const textColor = isActive ? "#0d1117" : "#8b949e";

        return (
          <g key={label}>
            {/* connector arrow (except last) */}
            {i < NODES.length - 1 && (
              <g>
                <line
                  x1={x + NODE_W}
                  y1={cy}
                  x2={x + NODE_W + GAP}
                  y2={cy}
                  stroke={isActive ? "#30363d" : "#21262d"}
                  strokeWidth={1.5}
                />
                <polygon
                  points={`${x + NODE_W + GAP - 5},${cy - 3} ${x + NODE_W + GAP},${cy} ${x + NODE_W + GAP - 5},${cy + 3}`}
                  fill={isActive ? "#30363d" : "#21262d"}
                />
              </g>
            )}
            {/* pill */}
            <g
              transform={`translate(${x + NODE_W / 2}, ${cy}) scale(${scaleClamped}) translate(${-(NODE_W / 2)}, ${-(NODE_H / 2)})`}
            >
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={NODE_H / 2}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1.5}
              />
              <text
                x={NODE_W / 2}
                y={NODE_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                fontSize={11}
                fontFamily='"JetBrains Mono", monospace'
                fontWeight={600}
              >
                {label}
              </text>
            </g>
            {/* glow */}
            {isActive && (
              <rect
                x={x}
                y={cy - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={NODE_H / 2}
                fill="none"
                stroke="#58a6ff"
                strokeWidth={6}
                opacity={0.18}
                style={{ filter: "blur(4px)" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
