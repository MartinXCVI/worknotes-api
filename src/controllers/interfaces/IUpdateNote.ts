import { Types } from "mongoose";

export interface IUpdateNote {
  id: string;
  user: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
}