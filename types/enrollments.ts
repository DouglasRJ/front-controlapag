import { Charge } from "./charge";
import { ChargeException } from "./charge-exception";
import { ChargeSchedule } from "./charge-schedule";
import { ENROLLMENT_STATUS } from "./enrollment-status";

export interface Enrollments {
  id: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  status: ENROLLMENT_STATUS;
  createdAt: Date;
  updatedAt: Date;
  chargeSchedule: ChargeSchedule;
  chargeExceptions: ChargeException[];
  charges: Charge[];
}
