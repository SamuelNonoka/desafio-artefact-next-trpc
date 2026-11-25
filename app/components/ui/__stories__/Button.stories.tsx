import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Salvar" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancelar" },
};
export const Danger: Story = {
  args: { variant: "danger", children: "Excluir" },
};
export const Ghost: Story = { args: { variant: "ghost", children: "Voltar" } };
export const Loading: Story = { args: { loading: true, children: "Salvando" } };
export const Disabled: Story = { args: { disabled: true } };
