export function LoomStudioLogo({ className }: { className?: string }) {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loom Studio Logo"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M20,20 L80,20 L80,80 L20,80 L20,20 Z M50,20 L50,80 M20,50 L80,50"
          stroke="url(#grad1)"
          strokeWidth="4"
          fill="none"
          transform="rotate(45 50 50)"
        />
        <circle cx="50" cy="50" r="10" fill="hsl(var(--primary))" />
      </svg>
    );
  }
  