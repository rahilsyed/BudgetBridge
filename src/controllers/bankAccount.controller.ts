import { Request, Response } from "express";
import { errorResponse, notFoundResponse, successResponse, validationError } from "../helpers/api_response.helper";
import utilsHelper from "../helpers/utils.helper";
import BankAccount from "../models/bankAccount.model";


//  _id:ObjectId;
//     userId: ObjectId;
//     bankName: String;
//     accountType: String;
//     balance: Number;
//     accountNumber: Number;
//     isPrimary: Boolean;
//     isActive:Boolean;

const addAccount = async (req: Request, res: Response) => {
    try {
        const { bankName, accountType, accountNumber, balance } = req.body;
        if (!bankName || !accountType || !accountNumber) {
            return validationError(res, "Missing Required Fields");
        }
        const userId = utilsHelper.getUserId(req);
        if (!userId) {
            validationError(res, "User is not Valid Contact admin Support");
        }
        const newAccount = new BankAccount({
            userId,
            bankName,
            accountType,
            accountNumber,
            balance,
            isPrimary: false,
            isActive: true
        })
        await newAccount.save();
        return successResponse(res, "Account Added Successfully", newAccount);
    } catch (error: any) {
        return errorResponse(res, error.message)
    }
}

const getAccounts = async (req: Request, res: Response) => {
    try {
        const userId = utilsHelper.getUserId(req);
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
        // const search = req.query.search ? req.query.search as string : "";


        if (!userId) {
            return validationError(res, "User is not Valid Contact admin Support");
        }
        const accounts = await BankAccount.find({userId}).limit(limit).skip(offset * limit).sort({createdAt:-1});
        console.log(accounts);
        if (!accounts) {
            return validationError(res, "No Bank Accounts found Please Add One ");
        }
        return successResponse(res, "Accounts Fetched Successfully", accounts);
    } catch (error: any) {
        return errorResponse(res, error.message)
    }
}


const getAccount = async(req:Request, res:Response)=>{
    try{
        const bankId= req.params.id;
        const userId = utilsHelper.getUserId(req);
        if(!userId){
            return validationError(res, "User is not Valid Contact admin Support");
        }
        if(!bankId){
            return notFoundResponse(res, "Account ID is required");
        }
        const account = await BankAccount.findById(bankId);
        if(!account){
            return notFoundResponse(res, "Account Not Found");
        }
        return successResponse(res, "Account Found Successfully", account);
    }catch(error:any){
        return errorResponse(res, error.message)
    }
}
export default {
    addAccount,
    getAccounts,
    getAccount
}