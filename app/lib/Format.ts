const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** E.g.: "25 de nov. de 2026, 14:00" */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
