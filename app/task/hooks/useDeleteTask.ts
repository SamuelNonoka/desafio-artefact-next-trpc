import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/app/lib/Errors";
import { trpc, type Task } from "@/app/lib/TRPC";
import { PAGE_SIZE } from "./useListTask";

export function useDeleteTask() {
  const utils = trpc.useUtils();
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>();

  const closeDialog = useCallback(() => setTaskToDelete(undefined), []);

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: ({ id }) => {
      // Remove do cache sem recarregar todas as páginas
      utils.task.list.setInfiniteData({ limit: PAGE_SIZE }, (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                items: page.items.filter((task) => task.id !== id),
              })),
            }
          : data,
      );
      utils.task.byId.invalidate({ id });
      toast.success("Tarefa excluída");
      closeDialog();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      closeDialog();
    },
  });

  function confirmDelete() {
    if (taskToDelete) deleteTask.mutate({ id: taskToDelete.id });
  }

  return {
    taskToDelete,
    requestDelete: setTaskToDelete,
    closeDialog,
    confirmDelete,
    isDeleting: deleteTask.isPending,
  };
}
