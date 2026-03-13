import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 32, height: 32, text: "text-lg" },
  md: { width: 40, height: 40, text: "text-xl" },
  lg: { width: 56, height: 56, text: "text-2xl" },
};

export function Logo({ className, size = "md" }: LogoProps) {
  const { width, height, text } = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background */}
        <circle cx="24" cy="24" r="23" stroke="#10B981" strokeWidth="2" fill="none" />
        {/* Heartbeat / pulse line */}
        <polyline
          points="4,24 14,24 18,14 22,34 26,10 30,38 34,24 44,24"
          stroke="#10B981"
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
