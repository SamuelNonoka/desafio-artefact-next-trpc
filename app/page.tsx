"use client";

import { Loader2, Plus, RotateCw } from "lucide-react";
import Link from "next/link";
import { ListTaskEmptyState } from "@/app/task/components/ListTaskEmptyState";
import { ListTaskErrorState } from "@/app/task/components/ListTaskErrorState";
import { TaskListSkeleton } from "@/app/task/components/TaskListSkeleton";
import { TaskCard } from "@/app/task/components/TaskCard";
import { Button, buttonClasses } from "@/app/components/ui/Button";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { getErrorMessage } from "@/app/lib/Errors";
import { useDeleteTask } from "@/app/task/hooks/useDeleteTask";
import { useListTask } from "@/app/task/hooks/useListTask";

export default function TaskListPage() {
  const { query, tasks, sentinelRef } = useListTask();
  const {
    taskToDelete,
    requestDelete,
    closeDialog,
    confirmDelete,
    isDeleting,
  } = useDeleteTask();
  const isInitialLoading = query.isPending;
  const isErrorState = query.isError && !query.data;
  const isEmptyState = tasks.length === 0 && !query.hasNextPage;

  function renderContent() {
    if (isInitialLoading) return <TaskListSkeleton />;

    // Error loading the first page
    if (isErrorState) {
      return (
        <ListTaskErrorState
          description={getErrorMessage(query.error)}
          onRetry={() => query.refetch()}
          isRetrying={query.isRefetching}
        />
      );
    }

    // Empty list
    if (isEmptyState) {
      return <ListTaskEmptyState />;
    }

    // List + infinite scroll footer
    return (
      <>
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onDelete={requestDelete}
            />
          ))}
        </ul>

        <div
          ref={sentinelRef}
          className="flex min-h-16 items-center justify-center py-4"
        >
          {query.isFetchingNextPage ? (
            <span className="animate-fade-in flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Carregando
              mais tarefas...
            </span>
          ) : query.isFetchNextPageError ? (
            <div
              role="alert"
              className="animate-fade-in flex flex-col items-center gap-2 text-sm"
            >
              <p className="text-red-600">
                Não foi possível carregar mais tarefas.
              </p>
              <Button variant="secondary" onClick={() => query.fetchNextPage()}>
                <RotateCw className="size-4" aria-hidden /> Tentar novamente
              </Button>
            </div>
          ) : query.hasNextPage ? (
            <Button variant="ghost" onClick={() => query.fetchNextPage()}>
              Carregar mais
            </Button>
          ) : (
            <p className="animate-fade-in text-sm text-slate-400">
              Você chegou ao fim da lista ✓
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            Minhas tarefas
            {query.isRefetching && !query.isFetchingNextPage && (
              <Loader2
                className="size-4 animate-spin text-slate-400"
                aria-label="Atualizando"
              />
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize o que precisa ser feito.
          </p>
        </div>
        <Link href="/task/new" className={buttonClasses("primary")}>
          <Plus className="size-4" aria-hidden /> Nova tarefa
        </Link>
      </div>

      {renderContent()}

      <ConfirmDialog
        open={!!taskToDelete}
        title="Excluir tarefa?"
        description={`"${taskToDelete?.titulo ?? ""}" será excluída permanentemente.`}
        confirmLabel="Excluir"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </div>
  );
}
