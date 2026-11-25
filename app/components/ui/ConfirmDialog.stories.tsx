import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    title: "Excluir item?",
    description: "Esta ação não pode ser desfeita.",
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomConfirmLabel: Story = { args: { confirmLabel: "Sim, excluir" } };
export const Loading: Story = { args: { loading: true } };
export const Closed: Story = { args: { open: false } };
