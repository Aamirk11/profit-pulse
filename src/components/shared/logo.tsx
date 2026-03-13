import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const sizeMap = {
  sm: { width: 32, height: 32, text: "text-lg", gap: "gap-2" },
  md: { width: 40, height: 40, text: "text-xl", gap: "gap-2" },
  lg: { width: 56, height: 56, text: "text-2xl", gap: "gap-3" },
  xl: { width: 72, height: 72, text: "text-4xl", gap: "gap-4" },
};

export function Logo({ className, size = "md", animate = true }: LogoProps) {
  const { width, height, text, gap } = sizeMap[size];

  return (
    <div className={cn("flex items-center logo-hover", gap, className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        {/* Circle background with gradient */}
        <circle cx="24" cy="24" r="23" fill="url(#logoEmeraldGrad)" />
        {/* Heartbeat / pulse line */}
        <polyline
          className={animate ? "pulse-line-animated" : undefined}
          points="4,24 14,24 18,14 22,34 26,10 30,38 34,24 44,24"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className={cn("font-bold tracking-tight text-emerald-500", text)}>
        ProfitPulse
      </span>
    </div>
  );
}
