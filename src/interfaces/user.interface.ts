import { ObjectId } from 'mongoose';

export default interface IUser{
    _id: ObjectId;
    firstName: string;
    lastName:string;
    email:string;
    password: string;
    phone: string;
    imgUrl: string;
}