import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "./Button";
import { StateMessage } from "./StateMessage";

const meta = {
  title: "UI/StateMessage",
  component: StateMessage,
  tags: ["autodocs"],
  args: { icon: Inbox, title: "Nada por aqui" },
} satisfies Meta<typeof StateMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    description: "Nenhum registro encontrado.",
    action: <Button>Criar novo</Button>,
  },
};
export const Error: Story = {
  args: {
    icon: AlertTriangle,
    tone: "error",
    title: "Algo deu errado",
    description: "Não foi possível carregar os dados.",
    action: <Button variant="secondary">Tentar novamente</Button>,
  },
};
export const WithoutDescription: Story = {};
