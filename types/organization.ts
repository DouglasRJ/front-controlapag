export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  image?: string;
}

export interface InviteSubProviderData {
  email: string;
  name: string;
}

