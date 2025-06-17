import { ObjectId } from 'mongoose';

export interface IExpense {
  _id: ObjectId;
  userId: ObjectId;
  icon: String;
  amount: Number;
  source: String;
  date: Date;
}
