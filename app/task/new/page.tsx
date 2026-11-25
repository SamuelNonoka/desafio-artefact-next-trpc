"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getErrorMessage } from "@/app/lib/Errors";
import { trpc } from "@/app/lib/TRPC";
import { TaskForm } from "@/app/task/components/TaskForm";

export default function NewTaskPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      toast.success("Tarefa criada com sucesso");
      router.push("/");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      <PageHeader
        title="Nova tarefa"
        description="Preencha os dados para criar uma tarefa."
      />
      <TaskForm
        submitLabel="Criar tarefa"
        // isSuccess mantém o botão em loading até a navegação terminar
        pending={createTask.isPending || createTask.isSuccess}
        serverError={createTask.error}
        onSubmit={(values) => createTask.mutate(values)}
      />
    </>
  );
}
