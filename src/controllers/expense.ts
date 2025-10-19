import { Request, Response } from 'express';
import utils from '../helpers/utils';
import { errorResponse, notFoundResponse, successResponse, validationError } from '../helpers/api_response';
import Expense from '../models/expense';
import User from '../models/user';
import xlsx from 'xlsx';
import BankAccount from '../models/bankAccount';

const addExpense = async (req: Request, res: Response) => {
  const { icon, amount, source, date, bankAccountId, description, paymentMethod, category } = req.body;

  try {

    const userId = utils.getUserId(req);
    const userExists = await User.findById(userId);

    if (!userExists) {
      return validationError(res, 'User does not exists in database');
    }

    if (!amount || !description || !bankAccountId) {
      return validationError(res, 'Missing Required Fields ');
    }

    const expenseDate = date ? new Date() : utils.getCurrentISTDate();

    const newExpense = new Expense({
      userId,
      amount,
      source,
      bankAccountId,
      icon,
      description,
      paymentMethod,
      category,
      date: expenseDate,
    });
    await newExpense.save();

    const updationInBankAccount = await BankAccount.findByIdAndUpdate(bankAccountId, {
      $inc: { balance: -amount },
    },
      {
        new: true
      })

    return successResponse(res, "Expense Added Successfully", { newExpense, updationInBankAccount });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// _id: ObjectId;
// userId: ObjectId;
// icon: String;
// amount: Number;
// source: String;
// date: Date;
// bankAccountId: ObjectId;
// description: String;
// paymentMethod:String;
// category: String;


const getAllExpense = async (req: Request, res: Response) => {
  try {
    const userId = await utils.getUserId(req)
    const userExistes = await Expense.findOne(userId);
    if (!userExistes) {
      return validationError(res, 'user does not existes in database');
    }
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search?.toString().trim();


    const query: any = {
      idDeleted: { $ne: true },
      userId,
    };


    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { source: { $regex: regex } },
        { description: { $regex: regex } },
        { amount: { $regex: regex } },
        { category: { $regex: regex } },
        { paymentMethod: { $regex: regex } }
      ]
    }
    const allExpenses = await Expense.find(query).limit(limit).skip(limit * offset).sort({ createdAt: -1 });

    if (allExpenses.length === 0) {
      return notFoundResponse(res, 'No expense Found');
    }

    const totalDocuments = await Expense.countDocuments(query);

    const result = {
      allExpenses,
      pagination: { limit, offset },
      totalDocuments
    }
    return successResponse(res, 'all response Found', result);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {

    const userId = await utils.getUserId(req);
    const userExistes = await User.findById(userId);

    if (!userExistes) {
      return notFoundResponse(res, 'user does not exists in database');
    }
    const expense = await Expense.findById(req.params.id)
    if (!expense) {
      return notFoundResponse(res, "Expense Not Found in the Database")
    }
    const updationInBankAccount = await BankAccount.findByIdAndUpdate(expense.bankAccountId, {
      $inc: { balance: expense.amount }
    }, { new: true });

    const deleteExpense = await Expense.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: { $ne: false } }
    },
      { new: true }
    );

    return successResponse(res, 'Expense deleted successfully', {deleteExpense, updationInBankAccount});
  } catch (error) { }
};

const downloadExpense = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req)
    const userExists = await User.findById(userId);
    if (!userExists) {
      return validationError(res, 'User not found in the database');
    }
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    const data = expense.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      date: item.date
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'expense')
    xlsx.writeFile(wb, `expense-details ${userExists.firstName}.xlsx`);
    res.download(`expense-details ${userExists.firstName}.xlsx`)
  } catch (error: any) {
    return errorResponse(res, error.message)
  }
};

export default {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpense,
};
