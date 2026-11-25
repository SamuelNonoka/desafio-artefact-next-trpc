import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskListSkeleton } from "../TaskListSkeleton";

const meta = {
  title: "Task/TaskListSkeleton",
  component: TaskListSkeleton,
  tags: ["autodocs"],
  args: { count: 4 },
} satisfies Meta<typeof TaskListSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Single: Story = { args: { count: 1 } };
