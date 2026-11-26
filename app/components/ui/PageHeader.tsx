import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PageHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
};

/** Header for the create and edit screens, with a link back to the list. */
export function PageHeader({
  title,
  description,
  backHref = "/",
}: PageHeaderProps) {
  return (
    <div className="animate-fade-in mb-6">
      <Link
        href={backHref}
        className="group mb-3 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden
        />
        Voltar para a lista
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}
