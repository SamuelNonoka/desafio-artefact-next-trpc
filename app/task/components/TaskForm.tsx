"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, buttonClasses } from "@/app/components/ui/Button";
import { useTaskFormHook } from "@/app/task/hooks/taskFormHook";
import { getFieldErrors } from "@/app/lib/Errors";
import {
  DESCRICAO_MAX,
  TITULO_MAX,
  taskFormSchema,
  type TaskFormSubmit,
  type TaskFormValues,
} from "@/app/task/types/Task.types";
import { Field } from "./Field";

type TaskFormProps = {
  defaultValues?: TaskFormValues;
  submitLabel: string;
  pending: boolean;
  /** Erro da mutation: usado para destacar campos rejeitados pela API. */
  serverError?: unknown;
  onSubmit: (values: TaskFormSubmit) => void;
};

const FIELDS = ["titulo", "descricao"] as const;

export function TaskForm({
  defaultValues = { titulo: "", descricao: "" },
  submitLabel,
  pending,
  serverError,
  onSubmit,
}: TaskFormProps) {
  const { inputClasses } = useTaskFormHook();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const titulo = useWatch({ control, name: "titulo" }) ?? "";
  const descricao = useWatch({ control, name: "descricao" }) ?? "";

  // Erros de validação vindos da API aparecem no campo correspondente
  useEffect(() => {
    const fieldErrors = getFieldErrors(serverError);
    for (const field of FIELDS) {
      const message = fieldErrors[field]?.[0];
      if (message) setError(field, { message });
    }
  }, [serverError, setError]);

  const submit = handleSubmit((values) =>
    onSubmit({
      titulo: values.titulo,
      descricao: values.descricao || undefined,
    }),
  );

  return (
    <form
      onSubmit={submit}
      noValidate
      className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <fieldset disabled={pending} className="space-y-6">
        <Field
          id="titulo"
          label="Título"
          error={errors.titulo?.message}
          counter={`${titulo.length}/${TITULO_MAX}`}
        >
          <input
            id="titulo"
            autoFocus
            placeholder="Ex.: Estudar tRPC"
            aria-invalid={!!errors.titulo}
            aria-describedby={errors.titulo ? "titulo-error" : undefined}
            className={inputClasses(!!errors.titulo)}
            {...register("titulo")}
          />
        </Field>

        <Field
          id="descricao"
          label="Descrição"
          optional
          error={errors.descricao?.message}
          counter={`${descricao.length}/${DESCRICAO_MAX}`}
        >
          <textarea
            id="descricao"
            rows={5}
            placeholder="Detalhes da tarefa (opcional)"
            aria-invalid={!!errors.descricao}
            aria-describedby={errors.descricao ? "descricao-error" : undefined}
            className={`${inputClasses(!!errors.descricao)} resize-y`}
            {...register("descricao")}
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/"
            className={buttonClasses("secondary")}
            aria-disabled={pending}
          >
            Cancelar
          </Link>
          <Button type="submit" loading={pending}>
            {pending ? "Salvando..." : submitLabel}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
