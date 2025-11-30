import { CHARGE_STATUS } from "./charge-status";

export interface Charge {
  id: string;
  amount: number;
  dueDate: Date;
  status: CHARGE_STATUS;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  enrollmentId: string;
  refundedAmount?: number;
}
