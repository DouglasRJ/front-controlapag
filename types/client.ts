import { Enrollments } from "./enrollments";
import { User } from "./user";

export interface Client {
  id: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  paymentCustomerId?: string;
  enrollments: Enrollments[];
  user?: User;
}
