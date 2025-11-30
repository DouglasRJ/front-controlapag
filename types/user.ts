import { Client } from "./client";
import { Provider } from "./provider";
import { USER_ROLE } from "./user-role";

export interface User {
  id: string;

  username: string;

  email: string;

  role: USER_ROLE;

  image?: string | undefined;

  createdAt: Date;

  updatedAt: Date;

  organizationId?: string;

  providerProfile: Provider;

  clientProfile: Client;
}
