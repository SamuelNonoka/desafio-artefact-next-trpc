import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StateMessageProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: "neutral" | "error";
  action?: ReactNode;
};

/** Centered block for empty, error and "not found" states. */
export function StateMessage({
  icon: Icon,
  title,
  description,
  tone = "neutral",
  action,
}: StateMessageProps) {
  const iconTone =
    tone === "error"
      ? "bg-red-50 text-red-600"
      : "bg-indigo-50 text-indigo-600";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="animate-fade-in-up flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
    >
      <div
        className={`mb-4 flex size-12 items-center justify-center rounded-full ${iconTone}`}
      >
        <Icon className="size-6" aria-hidden />
      </div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
