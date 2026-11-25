import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/app/components/ui/Button";
import { StateMessage } from "@/app/components/ui/StateMessage";

export function ListTaskEmptyState() {
  return (
    <StateMessage
      icon={ClipboardList}
      title="Nenhuma tarefa por aqui"
      description="Crie sua primeira tarefa para começar a se organizar."
      action={
        <Link href="/tarefas/nova" className={buttonClasses("primary")}>
          <Plus className="size-4" aria-hidden /> Criar tarefa
        </Link>
      }
    />
  );
}
