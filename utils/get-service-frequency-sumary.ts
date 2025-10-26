import { SERVICE_FREQUENCY } from "@/types/service-frequency";
import { ServiceSchedule } from "@/types/service-schedule";
import { formatTime } from "./format-date";

const daysOfWeekMap: { [key: number]: string } = {
  0: "Dom",
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
};

export function getServiceFrequencySummary(
  schedule?: ServiceSchedule | null
): string {
  if (!schedule) return "Não definido";

  let summary = "";
  switch (schedule.frequency) {
    case SERVICE_FREQUENCY.DAILY:
      summary = "Diariamente";
      break;
    case SERVICE_FREQUENCY.WEEKLY:
      const days = schedule.daysOfWeek
        ?.map((d) => daysOfWeekMap[d] || d)
        .join(", ");
      summary = `Semanal (${days || "Nenhum dia"})`;
      break;
    case SERVICE_FREQUENCY.MONTHLY:
      summary = `Mensal (dia ${schedule.dayOfMonth || "?"})`;
      break;
    case SERVICE_FREQUENCY.CUSTOM_DAYS:
      summary = "Dias Específicos";
      break;
    default:
      summary = schedule.frequency;
  }

  if (schedule.startTime) {
    summary += ` ${formatTime(schedule.startTime)}`;
    if (schedule.endTime) {
      summary += ` - ${formatTime(schedule.endTime)}`;
    }
  }

  return summary;
}
