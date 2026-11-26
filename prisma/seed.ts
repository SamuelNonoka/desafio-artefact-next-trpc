import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();

  const agora = Date.now();
  const total = 35; // enough to test infinite scroll

  await prisma.task.createMany({
    data: Array.from({ length: total }, (_, i) => ({
      titulo: `Tarefa ${i + 1}`,
      descricao: i % 3 === 0 ? undefined : `Descrição da tarefa ${i + 1}`,
      dataCriacao: new Date(agora - (total - i) * 60_000), // 1 minute apart
    })),
  });

  console.log(`🌱 ${total} tarefas criadas`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
