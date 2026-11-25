import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  counter?: string;
  children: ReactNode;
};

export function Field({
  id,
  label,
  optional,
  error,
  counter,
  children,
}: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {optional ? (
            <span className="ml-1 font-normal text-slate-400">(opcional)</span>
          ) : (
            <span className="ml-0.5 text-red-500">*</span>
          )}
        </label>
        {counter && (
          <span className="text-xs tabular-nums text-slate-400">{counter}</span>
        )}
      </div>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="animate-fade-in mt-1.5 flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
