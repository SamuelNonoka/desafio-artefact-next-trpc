import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TRPCClientError } from "@trpc/client";
import { fn } from "storybook/test";
import { TaskForm } from "../TaskForm";

const serverError = Object.assign(new TRPCClientError("Dados inválidos"), {
  data: {
    zodError: {
      fieldErrors: { titulo: ["Já existe uma tarefa com esse título"] },
    },
  },
});

const meta = {
  title: "Task/TaskForm",
  component: TaskForm,
  tags: ["autodocs"],
  args: { submitLabel: "Criar tarefa", pending: false, onSubmit: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};
export const Edit: Story = {
  args: {
    submitLabel: "Salvar alterações",
    defaultValues: { titulo: "Estudar tRPC", descricao: "Montar um exemplo." },
  },
};
export const Pending: Story = {
  args: {
    pending: true,
    defaultValues: { titulo: "Estudar tRPC", descricao: "" },
  },
};
export const WithServerError: Story = {
  args: {
    serverError,
    defaultValues: { titulo: "Estudar tRPC", descricao: "" },
  },
};
