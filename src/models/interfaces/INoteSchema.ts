import { Document, Types } from "mongoose";

export interface INoteSchema extends Document {
  user: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
  ticket?: number;
  createdAt?: Date;
  updatedAt?: Date;
}