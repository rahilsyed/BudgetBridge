import { Request, Response } from "express";
import { errorResponse, notFoundResponse, successResponse, validationError } from "../helpers/api_response";
import utilsHelper from "../helpers/utils";
import BankAccount from "../models/bankAccount";
import Income from "../models/income";
import Expense from "../models/expense";


const addAccount = async (req: Request, res: Response) => {
    try {
        const { bankName, accountType, accountNumber, balance } = req.body;
        if (!bankName || !accountType || !accountNumber) {
            return validationError(res, "Missing Required Fields");
        }
        if (balance < 0) {
            return validationError(res, "Balance cannot be Negitive")
        }
        const userId = utilsHelper.getUserId(req);
        if (!userId) {
            return validationError(res, "User is not Valid Contact admin Support");
        }
        await BankAccount.findOneAndUpdate({ userId, isPrimary: true, isDeleted: { $ne: true } }, {
            $set: { isPrimary: false }
        })
        const newAccount = new BankAccount({
            userId,
            bankName,
            accountType,
            accountNumber,
            balance,
            isPrimary: true,
            isActive: true
        });
        await newAccount.save();
        const addAmount = new Income({
            userId,
            source: "Bank Account Added",
            amount: balance,
            bankAccountId: newAccount._id,
            incomeType: "New account Opened",
            description: `Opened a new bank account`,
            date: Date.now(),
        })
        await addAmount.save();
        return successResponse(res, "Account Added Successfully", newAccount);
    } catch (error: any) {
        return errorResponse(res, error.message)
    }
}

const getAccounts = async (req: Request, res: Response) => {
    try {
        const userId = utilsHelper.getUserId(req);
        const limit = parseInt(req.query.limit as string) || 5;
        const offset = parseInt(req.query.offset as string) || 0;
        const searchTerm: string = req.query.search?.toString().trim();
        const query: any = {
            isDeleted: { $ne: true },
            userId
        };

        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');

            query.$or = [
                { bankName: regex },
                { accountType: regex },
                { accountNumber: regex },
            ]

        }
        if (!userId) {
            return validationError(res, "User is not Valid Contact admin Support");
        }
        const accounts = await BankAccount.find(query)
            .limit(limit)
            .skip(offset * limit)
            .sort({ createdAt: -1 });

        if (accounts.length === 0) {
            return validationError(res, "No Bank Accounts found Please Add One ");
        }
        const totalDocs = await BankAccount.countDocuments(query)
        return successResponse(res, "Accounts Fetched Successfully", {
            accounts, totalDocs, pagination: {
                offset,
                limit
            }
        });
    } catch (error: any) {
        return errorResponse(res, error.message)
    }
}


const getAccount = async (req: Request, res: Response) => {
    try {
        const bankId = req.params.id;
        const userId = utilsHelper.getUserId(req);
        if (!userId) {
            return validationError(res, "User is not Valid Contact admin Support");
        }
        if (!bankId) {
            return notFoundResponse(res, "Account ID is required");
        }
        const account = await BankAccount.findOne({
            _id: bankId,
            userId,
            isDeleted: { $ne: true }
        });
        if (!account) {
            return notFoundResponse(res, "Account Not Found");
        }
        return successResponse(res, "Account Found Successfully", account);
    } catch (error: any) {
        return errorResponse(res, error.message)
    }
}

const deleteAccount = async (req: Request, res: Response) => {
    try {
        const userId = await utilsHelper.getUserId(req);
        const { bankAccountId } = req.body;
        if (!userId) {
            return validationError(res, 'User not Found ')
        }

        if (!bankAccountId) {
            return validationError(res, 'Missing required fields');
        }
        const bankAccountExists = await BankAccount.findOne({ _id: bankAccountId, userId, isDeleted: { $ne: true } })
        if (!bankAccountExists) {
            return notFoundResponse(res, "bank account not found")
        }
        const data = await BankAccount.findByIdAndUpdate(
            bankAccountId,
            { $set: { isDeleted: true } },
            { new: true });
        if (!data) {
            return validationError(res, 'This bank accounts does not exists')
        }
        const createExpense = new Expense({
            userId,
            amount: data.balance,
            source: "Bank Account Deleted",
            bankAccountId,
            description: "Bank Account Deleted",
            date: Date.now(),
        });
        await createExpense.save();
        return successResponse(res, "BankAccount Deleted Successfully", data)
    } catch (error) {
        return errorResponse(res, error.message)
    }
}
const editAccount = async (req: Request, res: Response) => {
  try {
    const userId = utilsHelper.getUserId(req);
    const { bankName, accountType, accountNumber, balance, bankAccountId } = req.body;

    if (!userId) {
      return validationError(res, "User not found");
    }

    if (!bankAccountId) {
      return validationError(res, "Bank account ID is required");
    }

    const bankAccount = await BankAccount.findOne({
      _id: bankAccountId,
      userId,
      isDeleted: { $ne: true }
    });

    if (!bankAccount) {
      return notFoundResponse(res, "Bank account not found");
    }

   
    if (balance !== undefined && balance !== bankAccount.balance) {
      if (balance < 0) {
        return validationError(res, "Balance cannot be negative");
      }

        const newBalance = Number(balance);
        const oldBalance = Number(bankAccount.balance);

        const diff = newBalance - oldBalance;


      if (diff > 0) {
        await Income.create({
          userId,
          source: "Bank Account Edited",
          amount: diff,
          bankAccountId,
          incomeType: "Balance Adjustment",
          description: "Bank account balance increased",
          date: Date.now(),
        });
      }

      if (diff < 0) {
        await Expense.create({
          userId,
          amount: Math.abs(diff),
          source: "Bank Account Edited",
          bankAccountId,
          description: "Bank account balance decreased",
          date: Date.now(),
        });
      }
    }

    const updateData: any = { bankName, accountType, accountNumber };
    if (balance !== undefined) updateData.balance = balance;

    const result = await BankAccount.findByIdAndUpdate(
      bankAccountId,
      updateData,
      { new: true }
    );

    return successResponse(res, "Bank account updated successfully", result);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export default {
    addAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    editAccount
}