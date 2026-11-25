import { CalendarClock, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/Format";
import type { Task } from "@/app/lib/TRPC";

type TaskCardProps = {
  task: Task;
  /** Posição na página: usada para escalonar a animação de entrada. */
  index: number;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, index, onDelete }: TaskCardProps) {
  return (
    <li
      className="animate-fade-in-up group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
      style={{ animationDelay: `${(index % 10) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-slate-900">{task.titulo}</h3>

          {task.descricao ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {task.descricao}
            </p>
          ) : (
            <p className="mt-1 text-sm italic text-slate-400">Sem descrição</p>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarClock className="size-3.5" aria-hidden />
            Criada em {formatDate(task.dataCriacao)}
          </p>
        </div>

        {/* No desktop as ações aparecem no hover; no celular ficam sempre visíveis */}
        <div className="flex shrink-0 gap-1 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Link
            href={`/tarefas/${task.id}/editar`}
            aria-label={`Editar a tarefa ${task.titulo}`}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Excluir a tarefa ${task.titulo}`}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
