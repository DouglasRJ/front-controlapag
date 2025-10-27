import { BILLING_MODEL } from "@/types/billing-model";
import { ChargeSchedule } from "@/types/charge-schedule";
import { RECURRENCE_INTERVAL } from "@/types/recurrence-interval";
import { formatDate } from "./format-date";

export function getChargeFrequencySummary(
  schedule?: ChargeSchedule | null
): string {
  if (!schedule) return "Não definido";

  if (schedule.billingModel === BILLING_MODEL.ONE_TIME) {
    const dueDateFormatted = schedule.dueDate
      ? formatDate(schedule.dueDate)
      : "?";
    return `Única (${dueDateFormatted})`;
  }

  let intervalText = "";
  switch (schedule.recurrenceInterval) {
    case RECURRENCE_INTERVAL.WEEKLY:
      intervalText = "Semanal";
      break;
    case RECURRENCE_INTERVAL.MONTHLY:
      intervalText = "Mensal";
      break;
    case RECURRENCE_INTERVAL.BIMONTHLY:
      intervalText = "Bimestral";
      break;
    case RECURRENCE_INTERVAL.TRIMESTERLY:
      intervalText = "Trimestral";
      break;
    case RECURRENCE_INTERVAL.SEMIANNUALLY:
      intervalText = "Semestral";
      break;
    case RECURRENCE_INTERVAL.YEARLY:
      intervalText = "Anual";
      break;
    default:
      intervalText = schedule.recurrenceInterval || "";
  }

  if (
    schedule.recurrenceInterval &&
    schedule.recurrenceInterval !== RECURRENCE_INTERVAL.WEEKLY &&
    schedule.chargeDay
  ) {
    return `${intervalText} (dia ${schedule.chargeDay})`;
  }

  return intervalText || "Recorrente";
}
