import { Loader2 } from "lucide-react";

/** Exibido pelo Next durante a navegação entre páginas. */
export default function Loading() {
  return (
    <div
      className="animate-fade-in flex justify-center py-20"
      role="status"
      aria-label="Carregando"
    >
      <Loader2 className="size-6 animate-spin text-indigo-600" />
    </div>
  );
}
