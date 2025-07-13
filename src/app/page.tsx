
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";

/**
 * The main page component for Loom Studio, serving as the root of the application's UI.
 * It orchestrates the header, the main split-view layout, and the mobile-only bottom bar.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const { variant, ritual, setVariant, setRitual } = useSystemSigilState();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden">
        <SplitLayout
          variant={variant}
          ritual={ritual}
          setRitual={setRitual}
        />
      </main>
      <BottomBar
        onTogglePalette={() => {
          // This logic will be handled inside SplitLayout for mobile sheets
        }}
        onToggleInspector={() => {
          // This logic will be handled inside SplitLayout for mobile sheets
        }}
      />
    </div>
  );
}
