import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { InstallScene } from "./scenes/InstallScene";
import { ScaffoldScene } from "./scenes/ScaffoldScene";
import { SddWorkflowScene } from "./scenes/SddWorkflowScene";
import { ConstitutionScene } from "./scenes/ConstitutionScene";
import { SpecifyScene } from "./scenes/SpecifyScene";
import { PlanScene } from "./scenes/PlanScene";
import { TasksScene } from "./scenes/TasksScene";
import { ImplementScene } from "./scenes/ImplementScene";
import { ChecklistScene } from "./scenes/ChecklistScene";
import { OutroScene } from "./scenes/OutroScene";
import {
  SPECIFY1_LINES,
  SPECIFY1_SPEC,
  SPECIFY2_LINES,
  SPECIFY2_SPEC,
} from "./data/script";

// Scene frame table (from → durationInFrames)
const SCENES = {
  title:        { from: 0,    dur: 90  },   // 3 s
  install:      { from: 90,   dur: 240 },   // 8 s
  scaffold:     { from: 330,  dur: 540 },   // 18 s
  sddWorkflow:  { from: 870,  dur: 180 },   // 6 s
  constitution: { from: 1050, dur: 240 },   // 8 s
  specify1:     { from: 1290, dur: 360 },   // 12 s
  specify2:     { from: 1650, dur: 240 },   // 8 s
  plan:         { from: 1890, dur: 240 },   // 8 s
  tasks:        { from: 2130, dur: 240 },   // 8 s
  implement:    { from: 2370, dur: 450 },   // 15 s
  checklist:    { from: 2820, dur: 240 },   // 8 s
  outro:        { from: 3060, dur: 150 },   // 5 s
};

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
      <Sequence from={SCENES.title.from} durationInFrames={SCENES.title.dur}>
        <TitleScene />
      </Sequence>

      <Sequence from={SCENES.install.from} durationInFrames={SCENES.install.dur}>
        <InstallScene />
      </Sequence>

      <Sequence from={SCENES.scaffold.from} durationInFrames={SCENES.scaffold.dur}>
        <ScaffoldScene />
      </Sequence>

      <Sequence from={SCENES.sddWorkflow.from} durationInFrames={SCENES.sddWorkflow.dur}>
        <SddWorkflowScene />
      </Sequence>

      <Sequence from={SCENES.constitution.from} durationInFrames={SCENES.constitution.dur}>
        <ConstitutionScene />
      </Sequence>

      <Sequence from={SCENES.specify1.from} durationInFrames={SCENES.specify1.dur}>
        <SpecifyScene
          featureNum={1}
          terminalLines={SPECIFY1_LINES}
          specLines={SPECIFY1_SPEC}
          subtitle="EARS-shaped requirements, auto-numbered REQ-IDs"
        />
      </Sequence>

      <Sequence from={SCENES.specify2.from} durationInFrames={SCENES.specify2.dur}>
        <SpecifyScene
          featureNum={2}
          terminalLines={SPECIFY2_LINES}
          specLines={SPECIFY2_SPEC}
          subtitle="Each feature gets its own spec — traceable end-to-end"
        />
      </Sequence>

      <Sequence from={SCENES.plan.from} durationInFrames={SCENES.plan.dur}>
        <PlanScene />
      </Sequence>

      <Sequence from={SCENES.tasks.from} durationInFrames={SCENES.tasks.dur}>
        <TasksScene />
      </Sequence>

      <Sequence from={SCENES.implement.from} durationInFrames={SCENES.implement.dur}>
        <ImplementScene />
      </Sequence>

      <Sequence from={SCENES.checklist.from} durationInFrames={SCENES.checklist.dur}>
        <ChecklistScene />
      </Sequence>

      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.dur}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
