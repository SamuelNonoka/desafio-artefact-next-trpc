import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ListTaskErrorState } from "../ListTaskErrorState";

const meta = {
  title: "Task/ListTaskErrorState",
  component: ListTaskErrorState,
  tags: ["autodocs"],
  args: {
    description: "Não foi possível conectar ao servidor.",
    onRetry: fn(),
  },
} satisfies Meta<typeof ListTaskErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Retrying: Story = { args: { isRetrying: true } };
