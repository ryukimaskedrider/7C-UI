export interface IUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  address?: string;
  is_active?: any;
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
}

export interface Credentials {
  email: string;
  password: string;
  rememberConsent: boolean;
}
