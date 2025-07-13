
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";

/**
 * The main page component for Loom Studio, serving as the root of the application's UI.
 * It orchestrates the header, the main split-view layout, and the mobile-only bottom bar.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const { variant, ritual, setRitual } = useSystemSigilState();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden">
        <SplitLayout
          variant={variant}
          ritual={ritual}
          setRitual={setRitual}
          isPaletteOpen={isPaletteOpen}
          setIsPaletteOpen={setIsPaletteOpen}
          isInspectorOpen={isInspectorOpen}
          setIsInspectorOpen={setIsInspectorOpen}
        />
      </main>
      <BottomBar
        onTogglePalette={() => setIsPaletteOpen(p => !p)}
        onToggleInspector={() => setIsInspectorOpen(p => !p)}
      />
    </div>
  );
}
