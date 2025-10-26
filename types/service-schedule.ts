import { SERVICE_FREQUENCY } from "./service-frequency";
import { ServiceOccurrence } from "./service-ocurrency";

export interface ServiceSchedule {
  id: string;
  frequency: SERVICE_FREQUENCY;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  startTime?: string;
  endTime?: string;
  createdAt: Date;
  updatedAt: Date;
  enrollmentId?: string;
  serviceOccurrence?: ServiceOccurrence[];
}
