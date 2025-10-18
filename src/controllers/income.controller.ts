import { Request, Response } from 'express';
import Income from '../models/income.model';
import utils from '../helpers/utils.helper';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationError,
} from '../helpers/api_response.helper';
import xlsx from 'xlsx';
import BankAccount from '../models/bankAccount.model';
const addIncome = async (req: Request, res: Response) => {
  const { icon, source, amount, date, bankAccountId, description, incomeType } = req.body;
  try {
    const userId = utils.getUserId(req);
    if (!source || !amount || amount <= 0 || !description || !incomeType) {
      return validationError(res, 'Missing Required Fields');
    }
    const primaryAccountOfUser = await BankAccount.findOne({ userId, isPrimary: true })
    const incomeAccountId = bankAccountId ? bankAccountId : primaryAccountOfUser?._id

    if (!incomeAccountId) {
      return validationError(res, "Bank Account not provided or no primary account found")
    }
    const incomeDate = date ? new Date(date) : utils.getCurrentISTDate();

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: incomeDate,
      bankAccountId: incomeAccountId,
      incomeType,
      description
    });
    await newIncome.save();

    const bankAccount = await BankAccount.findByIdAndUpdate(incomeAccountId, {
      $inc: { balance: amount }
    },
      { new: true }
    );

    if (!bankAccount) {
      return notFoundResponse(res, "Bank Account Not Found")
    }
    const result = {
      bankAccount,
      newIncome
    }
    return successResponse(res, 'Income Added successfully in you Bank Account', result);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getAllIncomes = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req);

    const userIncome = await Income.find({ userId, isDeleted:{$ne:true} }).select(
      '-createdAt -updatedAt -__v'
    ).sort({ date: -1 });

    if (userIncome.length === 0) {
      return notFoundResponse(res, 'No Income Found for the current user');
    }

    return successResponse(res, 'All Incomes fetched ', userIncome)

  } catch (error) {
    return errorResponse(res, error.message)
  }
};

const deleteIncome = async (req: Request, res: Response) => {
  const incomeId = req.params.id;
  try {
    if (!incomeId) {
      return validationError(res, 'Missing required fields to delete an income')
    }
    const incomeDetails = await Income.findById(incomeId);
     if (!incomeDetails) {
      return notFoundResponse(res, "Income not found");
    }
    const bankAccount = await BankAccount.findByIdAndUpdate(
      incomeDetails.bankAccountId,
      { $inc: { balance: -incomeDetails.amount } },
      { new: true }
    );

    if (!bankAccount) {
      return notFoundResponse(res, "Bank account not found");
    }

    const deletedIncome = await Income.findByIdAndUpdate(
      incomeId,
      { $set: { isDeleted: true } }, // ensure matches schema
      { new: true }
    );
 
     return successResponse(res, "Income deleted successfully", {
      deletedIncome,
      bankAccount,
    });

  } catch (error :any) {
    return errorResponse(res, error.message);
  }
};
const downloadExcel = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req);
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString(),
      BankAccountId: item.bankAccountId.toString()
    }));
    console.log(data)
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, 'income_details.xlsx');
    res.download("income_details.xlsx")
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export default {
  addIncome,
  getAllIncomes,
  deleteIncome,
  downloadExcel,
};
