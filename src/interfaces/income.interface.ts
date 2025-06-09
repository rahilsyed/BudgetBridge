import { ObjectId } from 'mongoose';




export default interface IIncome {
    _id:ObjectId;
    userId:ObjectId;
    icon: string;
    source: string;
    amount: number;
    date : Date;
} 