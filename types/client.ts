import { Enrollments } from "./enrollments";

export interface Client {
  id: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  paymentCustomerId?: string;
  enrollments: Enrollments[];
}
