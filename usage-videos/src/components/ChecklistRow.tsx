import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";

type ChecklistRowProps = {
  label: string;
  delayFrames: number;
};

export const ChecklistRow: React.FC<ChecklistRowProps> = ({
  label,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - delayFrames);

  const labelOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const checkFrame = Math.max(0, localFrame - 8);
  const checkScale = spring({
    frame: checkFrame,
    fps: 30,
    config: { damping: 200, stiffness: 120 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: labelOpacity,
        marginBottom: 4,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 4,
          backgroundColor: "#3fb950",
          transform: `scale(${Math.min(checkScale, 1)})`,
          flexShrink: 0,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="#0d1117"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 15,
          color: "#c9d1d9",
        }}
      >
        {label}
      </span>
    </div>
  );
};
