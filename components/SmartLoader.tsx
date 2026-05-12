"use client";

interface SmartLoaderProps {
  label?: string;
  description?: string;
}

export function SmartLoader({ label, description }: SmartLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      {label && <p className="text-lg font-semibold text-foreground">{label}</p>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
