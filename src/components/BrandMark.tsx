type BrandMarkProps = {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  darkBackground?: boolean;
};

export function BrandMark({
  className,
  size = 64,
  showWordmark = false,
  darkBackground = false,
}: BrandMarkProps) {
  const stroke = "#00FF88";
  const secondary = "#00D9FF";
  const glow = "rgba(0, 255, 136, 0.4)";

  const Icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="DCintelix logo"
    >
      <defs>
        <linearGradient id="dcintelixGrad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#00FF88" />
          <stop offset="100%" stopColor="#00D9FF" />
        </linearGradient>
        <linearGradient id="dcintelixSoft" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,255,136,0.15)" />
          <stop offset="100%" stopColor="rgba(0,217,255,0.15)" />
        </linearGradient>
        <filter id="dcintelixGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#00FF88" floodOpacity="0.75" />
        </filter>
      </defs>

      <rect
        x="18"
        y="18"
        width="164"
        height="164"
        rx="42"
        fill={darkBackground ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.02)"}
        stroke="rgba(0, 0, 0, 0.08)"
      />

      <g filter="url(#dcintelixGlow)">
        <path
          d="M 100 30 A 70 70 0 1 1 52.6 164.4"
          fill="none"
          stroke="url(#dcintelixGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.95"
        />

        <path
          d="M 100 42 A 58 58 0 1 1 58.6 150.7"
          fill="none"
          stroke="url(#dcintelixSoft)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.8"
        />

        <path
          d="M 99 60 L 135 100 L 100 100 L 78 76"
          fill="none"
          stroke="url(#dcintelixGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 100 101 L 100 139"
          stroke="url(#dcintelixGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <path
          d="M 100 101 L 83 122"
          stroke="url(#dcintelixGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <path
          d="M 100 101 L 116 127"
          stroke="url(#dcintelixGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <path
          d="M 100 112 L 100 145"
          stroke="url(#dcintelixGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <path
          d="M 68 131 C 80 142, 90 148, 100 148 C 110 148, 120 142, 132 131"
          fill="none"
          stroke="url(#dcintelixGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.9"
        />

        <path
          d="M 80 142 C 89 151, 95 156, 100 156 C 105 156, 111 151, 120 142"
          fill="none"
          stroke="url(#dcintelixGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      <circle cx="100" cy="139" r="10" fill={secondary} opacity="0.95" />
      <circle cx="100" cy="139" r="4" fill="rgba(0,0,0,0.9)" />
    </svg>
  );

  if (!showWordmark) {
    return Icon;
  }

  return (
    <div className="flex items-center gap-3">
      {Icon}
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-bold tracking-tight text-white">DCINTELIX</span>
        <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#7be7bf]">CO LTD</span>
      </div>
    </div>
  );
}
