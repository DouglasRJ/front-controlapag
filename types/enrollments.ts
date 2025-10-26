import { Charge } from "./charge";
import { ChargeException } from "./charge-exception";
import { ChargeSchedule } from "./charge-schedule";
import { Client } from "./client";
import { ENROLLMENT_STATUS } from "./enrollment-status";
import { Service } from "./service";
import { ServiceSchedule } from "./service-schedule";

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
  client?: Client;
  service?: Service;
  serviceSchedules?: ServiceSchedule[];
}

export interface CreateChargeScheduleDto {
  frequency: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
}

export interface CreateServiceScheduleDto {
  frequency: string;
  daysOfWeek?: string[];
  dayOfMonth?: number | string;
  startTime?: string;
  endTime?: string;
}

export interface EnrollmentFormData {
  price: string;
  startDate: Date;
  endDate?: Date;
  status: ENROLLMENT_STATUS;
  serviceId: string;
  clientId: string;
  chargeSchedule: CreateChargeScheduleDto;
  serviceSchedule: CreateServiceScheduleDto;
}

export interface CreateEnrollmentDto {
  price: number;
  startDate: Date;
  endDate?: Date;
  status: ENROLLMENT_STATUS;
  serviceId: string;
  clientId: string;
  chargeSchedule: CreateChargeScheduleDto;
  serviceSchedule: CreateServiceScheduleDto;
}
