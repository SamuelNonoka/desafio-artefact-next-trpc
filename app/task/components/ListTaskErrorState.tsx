import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { StateMessage } from "@/app/components/ui/StateMessage";

type ListTaskErrorStateProps = {
  description: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function ListTaskErrorState({
  description,
  onRetry,
  isRetrying = false,
}: ListTaskErrorStateProps) {
  return (
    <StateMessage
      tone="error"
      icon={AlertTriangle}
      title="Não foi possível carregar as tarefas"
      description={description}
      action={
        <Button variant="secondary" onClick={onRetry} loading={isRetrying}>
          <RotateCw className="size-4" aria-hidden /> Tentar novamente
        </Button>
      }
    />
  );
}
