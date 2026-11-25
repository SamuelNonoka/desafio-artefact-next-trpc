/** Placeholder animado (pulse) exibido enquanto o formulário de tarefa carrega. */

export function TaskFormSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6 rounded-xl border border-slate-200 bg-white p-6"
      aria-busy
    >
      <div className="space-y-2">
        <div className="h-3.5 w-16 rounded bg-slate-200" />
        <div className="h-10 rounded-lg bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-20 rounded bg-slate-200" />
        <div className="h-32 rounded-lg bg-slate-100" />
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <div className="h-9 w-24 rounded-lg bg-slate-100" />
        <div className="h-9 w-36 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
