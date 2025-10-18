import { ObjectId } from "mongoose";


export interface IBankAccount{
    _id:ObjectId;
    userId: ObjectId;
    bankName: String;
    accountType: String;
    balance: Number;
    accountNumber: String;
    isPrimary: Boolean;
    isActive:Boolean;
}