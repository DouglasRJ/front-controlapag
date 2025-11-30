import { PROVIDER_STATUS } from "./provider-status";
import { Service } from "./service";

export interface Provider {
  id: string;
  title: string;
  bio: string;
  businessPhone: string;
  status: PROVIDER_STATUS;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  paymentCustomerId?: string;
  subscriptionId?: string;
  providerPaymentId?: string;
  organizationId?: string;
  services: Service[];
}
