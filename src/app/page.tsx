'use client';

import { useState } from "react";
import Header from "@/components/loom/header";
import WorkflowDesigner from "@/components/loom/workflow-designer";

export default function Home() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onTogglePalette={() => setIsPaletteOpen(prev => !prev)} 
        onToggleInspector={() => setIsInspectorOpen(prev => !prev)} 
      />
      <main className="flex-1 overflow-hidden">
        <WorkflowDesigner 
          isPaletteOpen={isPaletteOpen}
          onPaletteChange={setIsPaletteOpen}
          isInspectorOpen={isInspectorOpen}
          onInspectorChange={setIsInspectorOpen}
        />
      </main>
    </div>
  );
}
