/** Placeholder animado (pulse) exibido enquanto a lista de tarefas carrega. */

export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-3" aria-label="Carregando tarefas" aria-busy>
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-3/4 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
          <div className="mt-4 h-2.5 w-28 rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}
