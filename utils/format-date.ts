import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(
  date: string | Date | undefined | null,
  pattern = "dd/MM/yyyy"
): string {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Data inválida";
    return format(dateObj, pattern, { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "Data inválida";
  }
}

export function formatTime(
  time: string | undefined | null,
  includeSeconds = false
): string {
  if (!time) return "";
  try {
    const parts = time.split(":");
    if (parts.length < 2) return time;
    return includeSeconds ? time : `${parts[0]}:${parts[1]}`;
  } catch {
    return time;
  }
}
