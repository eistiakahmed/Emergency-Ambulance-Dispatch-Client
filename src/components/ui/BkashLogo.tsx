"use client";

interface BkashLogoProps {
  className?: string;
  variant?: "full" | "icon" | "badge";
  size?: "sm" | "md" | "lg";
}

export function BkashIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-[#E2136E] p-2.5 shadow-md shadow-[#E2136E]/25 select-none overflow-hidden ${className}`}
    >
      <svg
        viewBox="160 -5 175 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Official bKash Origami Flying Dove Coordinates */}
        <polygon
          points="225.42,71.2 234.67,112.76 295.16,82.13"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <polygon points="242.63,9.1 225.43,71.21 295.18,82.13" fill="#FFFFFF" />
        <polygon
          points="168.73,0 240.86,8.62 223.81,70.36"
          fill="#FCE4EC"
          opacity="0.95"
        />
        <polygon
          points="168.15,12.15 176.19,12.15 198.73,40.96"
          fill="#F8BBD0"
        />
        <polygon
          points="297.09,81.74 276.12,52.72 310.04,46.65"
          fill="#FFFFFF"
          opacity="0.9"
        />
        <polygon
          points="293.59,90.24 295.74,83.78 242.81,110.64"
          fill="#F8BBD0"
        />
        <polygon
          points="223.94,72.84 234.98,122.49 202.2,149.14"
          fill="#F48FB1"
        />
        <polygon
          points="306.73,61.4 325.98,61.07 312.07,46.92"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

export function BkashLogo({
  className = "",
  variant = "full",
  size = "md",
}: BkashLogoProps) {
  if (variant === "icon") {
    const sizeClasses = {
      sm: "h-6 w-6",
      md: "h-10 w-10",
      lg: "h-14 w-14",
    };
    return <BkashIcon className={`${sizeClasses[size]} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <BkashIcon
        className={
          size === "lg" ? "h-10 w-10" : size === "sm" ? "h-6 w-6" : "h-8 w-8"
        }
      />
      <span className="font-black tracking-tight text-[#E2136E] text-xl font-sans">
        bKash
      </span>
    </div>
  );
}
