import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Lexend, Comfortaa } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Loom Studio',
  description: 'Visually orchestrate complex agentic workflows.',
};

const fontBody = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fontHeadline = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: '700',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", fontBody.variable, fontHeadline.variable)}>
      <head>
          <link
            rel="icon"
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='90' fill='hsl(279 70% 58%)'%3EΞ%3C/text%3E%3C/svg%3E"
          />
      </head>
      <body className="font-body antialiased flex flex-col h-screen bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
