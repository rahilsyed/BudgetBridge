import mongoose, { Schema } from 'mongoose';
import IIncome from '../interfaces/income.interface';
const incomeSchema: Schema<IIncome> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    icon: {
      type: String,
    },
    source: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Income = mongoose.model<IIncome>('income', incomeSchema);
export default  Income ;
