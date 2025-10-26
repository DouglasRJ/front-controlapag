import { Enrollments } from "./enrollments";
import { PAYMENT_METHOD } from "./payment-method";

export interface Service {
  id: string;
  name: string;
  description: string;
  defaultPrice?: number;
  isActive: boolean;
  address: string;
  allowedPaymentMethods: PAYMENT_METHOD[];
  createdAt: Date;
  enrollments: Enrollments[];
  isRecurrent: boolean;
}
