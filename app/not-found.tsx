import { Compass } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/app/components/ui/Button";
import { StateMessage } from "@/app/components/ui/StateMessage";

/** 404 page for nonexistent routes. */
export default function NotFound() {
  return (
    <StateMessage
      icon={Compass}
      title="Página não encontrada"
      description="O endereço acessado não existe."
      action={
        <Link href="/" className={buttonClasses("primary")}>
          Ir para a lista de tarefas
        </Link>
      }
    />
  );
}
