import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type TextOverlayProps = {
  headline: string;
  sub?: string;
  align?: "center" | "left";
};

export const TextOverlay: React.FC<TextOverlayProps> = ({
  headline,
  sub,
  align = "center",
}) => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headlineY = interpolate(frame, [0, 18], [20, 0], {
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [12, 24], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textAlign = align === "center" ? "center" : "left";

  return (
    <div style={{ textAlign }}>
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: 42,
          fontWeight: 700,
          color: "#c9d1d9",
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          letterSpacing: -0.5,
          lineHeight: 1.2,
        }}
      >
        {headline}
      </div>
      {sub && (
        <div
          style={{
            opacity: subOpacity,
            marginTop: 10,
            fontSize: 20,
            color: "#8b949e",
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};
