import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field } from "../Field";

const meta = {
  title: "Task/Field",
  component: Field,
  tags: ["autodocs"],
  args: {
    id: "titulo",
    label: "Título",
    children: (
      <input
        id="titulo"
        className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
      />
    ),
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {};
export const Optional: Story = { args: { label: "Descrição", optional: true } };
export const WithCounter: Story = { args: { counter: "12/120" } };
export const WithError: Story = { args: { error: "Título é obrigatório" } };
