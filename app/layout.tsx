import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { ListTodo } from "lucide-react";
import { Toaster } from "sonner";
import { Providers } from "./Providers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DesafioArtefact",
  description: "Gerenciador de tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geist.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <Providers>
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
              <Link href="/" className="group flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
                  <ListTodo className="size-5" />
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  Organizador de Tarefas
                </span>
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>

          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
