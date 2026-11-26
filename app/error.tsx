"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { StateMessage } from "@/app/components/ui/StateMessage";

/** Catches unexpected rendering errors on any page. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StateMessage
      tone="error"
      icon={AlertTriangle}
      title="Algo deu errado"
      description="Ocorreu um erro inesperado ao exibir esta página."
      action={
        <Button variant="secondary" onClick={reset}>
          <RotateCw className="size-4" aria-hidden /> Tentar novamente
        </Button>
      }
    />
  );
}
