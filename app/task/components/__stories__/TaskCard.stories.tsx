import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import type { Task } from "@/app/lib/TRPC";
import { TaskCard } from "../TaskCard";

const baseTask = {
  id: "1",
  titulo: "Estudar tRPC",
  descricao: "Ler a documentação e montar um exemplo com Next.js.",
  dataCriacao: new Date("2026-11-25T14:00:00"),
} as unknown as Task;

const meta = {
  title: "Task/TaskCard",
  component: TaskCard,
  tags: ["autodocs"],
  args: { task: baseTask, index: 0, onDelete: fn() },
  decorators: [
    (Story) => (
      <ul className="max-w-xl">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutDescription: Story = {
  args: { task: { ...baseTask, descricao: null } as unknown as Task },
};
export const LongText: Story = {
  args: {
    task: {
      ...baseTask,
      titulo:
        "Um título extremamente longo que precisa ser truncado na interface do cartão",
      descricao: "Uma descrição bem longa. ".repeat(12),
    } as unknown as Task,
  },
};
