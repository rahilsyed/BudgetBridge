export type User = {
  _id?: string;
  companyId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
  password?: string;
};
export type WelcomeEmailData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};