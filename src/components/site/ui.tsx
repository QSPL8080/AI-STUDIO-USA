import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[72px] px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:py-14 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-8 sm:mb-10 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <span className="eyebrow">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
        </span>
        {eyebrow}
      </span>
      <h2 className="mt-3.5 font-heading text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl text-slate-900">
        {title}{" "}
        {highlight ? (
          <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5">
            {highlight}
          </span>
        ) : null}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function NeonButton({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "primary" | "call" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : size === "lg"
      ? "px-8 py-3.5 text-base"
      : "px-6 py-3 text-sm";
  const base =
    `inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 cursor-pointer ${sizeClasses}`;
  const styles =
    variant === "call" || variant === "secondary"
      ? "border border-purple-200/90 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 text-purple-900 font-bold shadow-xs hover:from-violet-200 hover:via-purple-200 hover:to-pink-200 hover:border-purple-400 hover:text-purple-950 hover:shadow-md hover:shadow-purple-500/15 active:scale-95"
      : variant === "ghost"
      ? "border border-slate-300 bg-white text-slate-800 hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50/60 shadow-xs active:scale-95"
      : "bg-gradient-brand text-white shadow-md glow-neon hover:brightness-110 active:scale-95";
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}
