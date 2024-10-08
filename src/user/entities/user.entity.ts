export class User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  taxPin?: string;
  email: string;
  roleId: string;
  password?: string;
  emailVerifiedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
