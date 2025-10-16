import  mongoose, {Schema} from "mongoose";
import { IBankAccount } from "../interfaces/bankAccount.interface";



const bankAccountSchema :Schema<IBankAccount> = new Schema<IBankAccount>({
    accountNumber:{
        type: Number,
        required: true,
        min:4,
        max:4,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true,
    },
    accountType:{
        type: String,
        enum: ['Savings', 'current', 'Salary'],
        required: true
    },
    bankName:{
        type: String,
        required: true,
    },
    isPrimary:{
        type: Boolean,
        default: false
    },
    isActive:{
        type: Boolean,
        default: true
    },
    balance:{
        type: Number,
        default: 0
    },
},{
    timestamps:true,
    collection: 'bankAccounts'
});

const BankAccount = mongoose.model("bankAccounts", bankAccountSchema)
export default BankAccount;