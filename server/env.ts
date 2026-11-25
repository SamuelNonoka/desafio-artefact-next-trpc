import { z } from "zod";

// Carrega o .env nativamente (Node >= 20.12). Em produção, sem o arquivo,
// as variáveis vêm do próprio ambiente (Docker, plataforma de deploy etc.).
try {
  process.loadEnvFile();
} catch {
  // sem .env: segue com as variáveis já definidas
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  CORS_ORIGIN: z.url("CORS_ORIGIN deve ser uma URL válida"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Variáveis de ambiente inválidas:",
    z.flattenError(parsed.error).fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
