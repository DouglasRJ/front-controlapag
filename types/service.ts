import { Enrollments } from "./enrollments";

export interface Service {
  id: string;
  name: string;
  description: string;
  defaultPrice?: number;
  isActive: boolean;
  createdAt: Date;
  enrollments: Enrollments[];
}
