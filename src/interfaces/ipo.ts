import { ObjectId } from 'mongoose';

export default interface IIpo {
    _id:ObjectId;
    listingName:string;
    price : string;
    numberOfShares: number;
    userId:ObjectId;
    expectedGMP:string;
    listingDate?: Date;
    isApplied: boolean;
    bankAccountId:ObjectId;
    fundsReleaseDate?: Date;
    isAlloted:boolean;
}