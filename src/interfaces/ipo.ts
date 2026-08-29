import { ObjectId } from 'mongoose';

export default interface IIpo {
    _id:ObjectId;
    listingName:string;
    price : number;
    numberOfShares: number;
    userId:ObjectId;
    expectedGMP:string;
    listingDate?: string;
    isApplied: boolean;
    bankAccountId:ObjectId;
    fundsReleaseDate?: string;
    isAlloted:boolean;
}