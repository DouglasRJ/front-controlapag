import { EXCEPTION_ACTION } from "./exception-action";

export interface ChargeException {
  id: string;
  originalChargeDate: Date;
  action: EXCEPTION_ACTION;
  newDueDate?: Date;
  newAmount?: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
