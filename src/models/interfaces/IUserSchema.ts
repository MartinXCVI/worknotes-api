import { Document } from 'mongoose';

export interface IUserSchema extends Document {
  username: string;
  password: string;
  roles: string[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}