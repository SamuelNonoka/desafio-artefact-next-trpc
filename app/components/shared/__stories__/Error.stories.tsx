import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import GlobalError from "../../../error";

const meta = {
  title: "Shared/Error",
  component: GlobalError,
  tags: ["autodocs"],
  args: {
    error: new Error("Erro inesperado"),
    reset: fn(),
  },
} satisfies Meta<typeof GlobalError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
