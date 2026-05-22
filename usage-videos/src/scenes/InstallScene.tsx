import React from "react";
import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";
import { Terminal } from "../components/Terminal";
import { INSTALL_LINES } from "../data/script";

export const InstallScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        padding: "48px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <TextOverlay headline="Install the plugins" sub="One command per plugin — no config needed" align="left" />
      <div style={{ maxWidth: 680 }}>
        <Terminal lines={INSTALL_LINES} charsPerSecond={50} />
      </div>
    </AbsoluteFill>
  );
};
