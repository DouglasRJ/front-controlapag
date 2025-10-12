import { BILLING_MODEL } from "./billing-model";
import { RECURRENCE_INTERVAL } from "./recurrence-interval";

export interface ChargeSchedule {
  id: string;
  billingModel: BILLING_MODEL;
  recurrenceInterval?: RECURRENCE_INTERVAL;
  chargeDay: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
