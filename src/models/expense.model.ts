import mongoose, { Schema } from 'mongoose';
import { IExpense } from '../interfaces/expense.interface';


const expenseSchema: Schema<IExpense> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    icon: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    bankAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bankAccounts",
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'expense'
});


const Expense = mongoose.model<IExpense>('expense', expenseSchema);
export default Expense;