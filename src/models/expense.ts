import mongoose, { Schema } from 'mongoose';
import { IExpense } from '../interfaces/expense';


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
        
    },
    category: {
        type: String,
       
    }
}, {
    timestamps: true,
    collection: 'expense'
});


const Expense = mongoose.model<IExpense>('expense', expenseSchema);
export default Expense;