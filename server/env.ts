import { z } from "zod";

// Loads .env natively (Node >= 20.12). In production, without the file,
// variables come from the environment itself (Docker, deploy platform, etc.).
try {
  process.loadEnvFile();
} catch {
  // no .env: continue with the variables already set
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
