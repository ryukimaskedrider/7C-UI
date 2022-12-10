import { BaseModel } from './base.model';
import { IUser } from '@core/_types/user.interface';
import { ROLE } from '@core/_constants';

export class User extends BaseModel implements IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  isActive?: any;
  role?: string;
  permissions?: string[];
  rank?: string;
  membership?: string;
  packageName?: string;
  package?: {
    code?: string
  };
  createdAt?: string;
  updatedAt?: string;
  isParentAgent?: boolean;

  constructor() {
    super();
  }

  get nameCode(): string {
    return `${this.firstName?.charAt(0).toUpperCase()} ${this.lastName?.charAt(0).toUpperCase()}`;
  }

  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  hasRole(role: Array<string>): boolean {
    return role.some(r => this.role?.includes(r));
  }

  isReseller(): boolean {
    return this.role === ROLE.RESELLER;
  }

  isSuperAdmin(): boolean {
    return this.role === ROLE.SUPERADMIN;
  }
}
