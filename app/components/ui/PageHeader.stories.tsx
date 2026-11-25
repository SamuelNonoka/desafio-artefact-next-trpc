import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: { title: "Novo cadastro" },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = {
  args: { description: "Preencha os campos abaixo para continuar." },
};
export const CustomBackHref: Story = {
  args: { title: "Editar", backHref: "/itens" },
};
