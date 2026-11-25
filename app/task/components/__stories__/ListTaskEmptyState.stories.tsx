import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListTaskEmptyState } from "../ListTaskEmptyState";

const meta = {
  title: "Task/ListTaskEmptyState",
  component: ListTaskEmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof ListTaskEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
