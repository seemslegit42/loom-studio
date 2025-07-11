'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SigilRites } from '@/components/sigil-rites/SigilRites';
import { useLoom } from './loom-provider';

export default function VisualWeaver() {
  const { ritual, variant } = useLoom();

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-accent/20 shadow-lg shadow-accent/5">
      <CardHeader>
        <CardTitle className="font-headline text-accent">The Visual Weaver</CardTitle>
        <CardDescription>The ritual is now in motion. Observe the agentic patterns.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-8">
        <SigilRites ritual={ritual} variant={variant} sonicSignature={true} />
      </CardContent>
    </Card>
  );
}
