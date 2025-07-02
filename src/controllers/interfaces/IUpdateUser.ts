export interface IUpdateUser {
  id: string;
  username: string;
  roles: string[];
  active: boolean;
  password?: string;
}