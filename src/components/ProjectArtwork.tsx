import React from 'react';

interface ProjectArtworkProps {
  variant: 'transit' | 'sentinel';
  className?: string;
}

export function HeroEngineeringPlate() {
  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-[#D4DFDC] bg-[#EAF1EF] dark:border-[#243B43] dark:bg-[#13242A]">
      <svg
        viewBox="0 0 640 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full object-cover"
        role="img"
        aria-label="Architectural geometric composition representing systems design and artificial intelligence engineering"
      >
        <defs>
          <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 32 0 L 0 0 0 32"
              className="stroke-[#C5D6D2] dark:stroke-[#1E353D]"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="hero-arc" x1="120" y1="80" x2="520" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B6B62" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#0B6B62" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <rect width="640" height="480" fill="url(#hero-grid)" />

        {/* Concentric engineering arcs */}
        <circle
          cx="320"
          cy="240"
          r="168"
          className="stroke-[#0B6B62]/25 dark:stroke-[#5FD0C3]/25"
          strokeWidth="1.25"
        />
        <circle
          cx="320"
          cy="240"
          r="118"
          fill="url(#hero-arc)"
          className="stroke-[#0B6B62]/45 dark:stroke-[#5FD0C3]/40"
          strokeWidth="1.5"
        />
        <circle
          cx="320"
          cy="240"
          r="64"
          className="fill-[#F6F8F7]/85 stroke-[#0B6B62] dark:fill-[#0C161B]/85 dark:stroke-[#5FD0C3]"
          strokeWidth="1.75"
        />

        {/* Orthogonal axes */}
        <line
          x1="64"
          y1="240"
          x2="576"
          y2="240"
          className="stroke-[#0B6B62]/30 dark:stroke-[#5FD0C3]/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="320"
          y1="44"
          x2="320"
          y2="436"
          className="stroke-[#0B6B62]/30 dark:stroke-[#5FD0C3]/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Connected nodes */}
        <path
          d="M172 152 L320 240 L468 148 L432 332 L196 340 Z"
          className="stroke-[#0B6B62] dark:stroke-[#5FD0C3]"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="172" cy="152" r="7" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle cx="468" cy="148" r="7" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle cx="432" cy="332" r="7" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle cx="196" cy="340" r="7" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle
          cx="320"
          cy="240"
          r="11"
          className="fill-[#F6F8F7] stroke-[#0B6B62] dark:fill-[#0C161B] dark:stroke-[#5FD0C3]"
          strokeWidth="3"
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-[#D4DFDC]/90 bg-[#F6F8F7]/90 px-5 py-3 text-xs text-[#4D626A] backdrop-blur-sm dark:border-[#243B43]/90 dark:bg-[#0C161B]/90 dark:text-[#9BB2BA]">
        <span>B.Tech CSE (AI &amp; ML)</span>
        <span className="font-mono-tabular">Jain University · 2nd Year</span>
      </div>
    </div>
  );
}

export function ProjectArtwork({ variant, className = '' }: ProjectArtworkProps) {
  if (variant === 'transit') {
    return (
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#D4DFDC] bg-[#EAF1EF] dark:border-[#243B43] dark:bg-[#13242A] ${className}`}
      >
        <svg
          viewBox="0 0 640 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          role="img"
          aria-label="Jain Transit campus bus route schematic"
        >
          <defs>
            <pattern id="transit-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" className="fill-[#B7CBC6] dark:fill-[#27434C]" />
            </pattern>
          </defs>
          <rect width="640" height="480" fill="url(#transit-dots)" />

          {/* Secondary route */}
          <path
            d="M72 344 C180 344, 210 210, 330 210 C450 210, 470 128, 568 128"
            className="stroke-[#0B6B62]/30 dark:stroke-[#5FD0C3]/25"
            strokeWidth="4"
            strokeDasharray="8 8"
          />

          {/* Primary transit corridor */}
          <path
            d="M72 156 L220 156 C268 156, 286 284, 344 284 L568 284"
            className="stroke-[#0B6B62] dark:stroke-[#5FD0C3]"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Transit stops */}
          {[
            { x: 112, y: 156, label: 'Stop 01' },
            { x: 220, y: 156, label: 'Hub' },
            { x: 344, y: 284, label: 'Gate' },
            { x: 492, y: 284, label: 'Campus' },
          ].map((stop) => (
            <g key={stop.label}>
              <circle
                cx={stop.x}
                cy={stop.y}
                r="13"
                className="fill-[#F6F8F7] stroke-[#0B6B62] dark:fill-[#0C161B] dark:stroke-[#5FD0C3]"
                strokeWidth="3.5"
              />
              <circle cx={stop.x} cy={stop.y} r="4.5" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
            </g>
          ))}

          {/* Schedule frame */}
          <rect
            x="384"
            y="78"
            width="184"
            height="92"
            rx="10"
            className="fill-[#F6F8F7] stroke-[#C5D6D2] dark:fill-[#0F1B20] dark:stroke-[#2A4149]"
            strokeWidth="1.5"
          />
          <rect x="404" y="100" width="76" height="8" rx="4" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
          <rect x="404" y="120" width="142" height="7" rx="3.5" className="fill-[#C5D6D2] dark:fill-[#2A4149]" />
          <rect x="404" y="138" width="110" height="7" rx="3.5" className="fill-[#D4DFDC] dark:fill-[#20363E]" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#D4DFDC] bg-[#EAF1EF] dark:border-[#243B43] dark:bg-[#13242A] ${className}`}
    >
      <svg
        viewBox="0 0 640 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        role="img"
        aria-label="Wonderla Sentinel interactive prism and signal geometry"
      >
        <defs>
          <linearGradient id="prism-fill" x1="190" y1="90" x2="450" y2="390" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B6B62" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0B6B62" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Orbital rings */}
        <ellipse
          cx="320"
          cy="240"
          rx="210"
          ry="86"
          transform="rotate(-18 320 240)"
          className="stroke-[#0B6B62]/30 dark:stroke-[#5FD0C3]/25"
          strokeWidth="1.5"
        />
        <ellipse
          cx="320"
          cy="240"
          rx="210"
          ry="86"
          transform="rotate(24 320 240)"
          className="stroke-[#0B6B62]/30 dark:stroke-[#5FD0C3]/25"
          strokeWidth="1.5"
        />

        {/* Faceted prism */}
        <polygon
          points="320,82 448,216 320,398 192,216"
          fill="url(#prism-fill)"
          className="stroke-[#0B6B62] dark:stroke-[#5FD0C3]"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line
          x1="320"
          y1="82"
          x2="320"
          y2="398"
          className="stroke-[#0B6B62]/50 dark:stroke-[#5FD0C3]/45"
          strokeWidth="1.5"
        />
        <line
          x1="192"
          y1="216"
          x2="448"
          y2="216"
          className="stroke-[#0B6B62]/50 dark:stroke-[#5FD0C3]/45"
          strokeWidth="1.5"
        />

        {/* Anchor vertices */}
        <circle cx="320" cy="82" r="6" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle cx="448" cy="216" r="6" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle cx="320" cy="398" r="6" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle cx="192" cy="216" r="6" className="fill-[#0B6B62] dark:fill-[#5FD0C3]" />
        <circle
          cx="320"
          cy="216"
          r="10"
          className="fill-[#F6F8F7] stroke-[#0B6B62] dark:fill-[#0C161B] dark:stroke-[#5FD0C3]"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
