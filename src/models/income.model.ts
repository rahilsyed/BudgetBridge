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
      min:0
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'bankAccounts',
      required: true,
    },
    incomeType: {
      type: String,
      required: true,
      // enum:['Salary','SideHustle','Other']
    },
    description: {
      type: String,
      required: true,
    },
    isDeleted:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    collection:'income',
  }
);

const Income = mongoose.model<IIncome>('income', incomeSchema);
export default Income;
