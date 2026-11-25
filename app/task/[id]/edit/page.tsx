"use client";

import { AlertTriangle, RotateCw, SearchX } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { StateMessage } from "@/app/components/ui/StateMessage";
import { getErrorCode, getErrorMessage } from "@/app/lib/Errors";
import { formatDate } from "@/app/lib/Format";
import { trpc } from "@/app/lib/TRPC";
import { TaskForm } from "@/app/task/components/TaskForm";
import { TaskFormSkeleton } from "@/app/task/components/TaskFormSkeleton";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = trpc.useUtils();

  const task = trpc.task.byId.useQuery({ id });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: (updated) => {
      utils.task.byId.setData({ id }, updated);
      utils.task.list.invalidate();
      toast.success("Tarefa atualizada");
      router.push("/");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // Loading
  if (task.isPending) {
    return (
      <>
        <PageHeader title="Editar tarefa" />
        <TaskFormSkeleton />
      </>
    );
  }

  // Erro: tarefa inexistente (ou ID inválido na URL) x falha genérica
  if (task.isError) {
    const code = getErrorCode(task.error);
    const notFound = code === "NOT_FOUND" || code === "BAD_REQUEST";

    return (
      <>
        <PageHeader title="Editar tarefa" />
        {notFound ? (
          <StateMessage
            icon={SearchX}
            title="Tarefa não encontrada"
            description="Ela pode ter sido excluída ou o link está incorreto."
            action={
              <Link href="/" className={buttonClasses("secondary")}>
                Voltar para a lista
              </Link>
            }
          />
        ) : (
          <StateMessage
            tone="error"
            icon={AlertTriangle}
            title="Não foi possível carregar a tarefa"
            description={getErrorMessage(task.error)}
            action={
              <Button
                variant="secondary"
                onClick={() => task.refetch()}
                loading={task.isRefetching}
              >
                <RotateCw className="size-4" aria-hidden /> Tentar novamente
              </Button>
            }
          />
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Editar tarefa"
        description={`Criada em ${formatDate(task.data.dataCriacao)}`}
      />
      <TaskForm
        defaultValues={{
          titulo: task.data.titulo,
          descricao: task.data.descricao ?? "",
        }}
        submitLabel="Salvar alterações"
        pending={updateTask.isPending || updateTask.isSuccess}
        serverError={updateTask.error}
        onSubmit={(values) => updateTask.mutate({ id, ...values })}
      />
    </>
  );
}
