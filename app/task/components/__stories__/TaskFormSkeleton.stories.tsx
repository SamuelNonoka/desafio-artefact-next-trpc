import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskFormSkeleton } from "../TaskFormSkeleton";

const meta = {
  title: "Task/TaskFormSkeleton",
  component: TaskFormSkeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof TaskFormSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
