import { Request, Response } from 'express';
import utils from '../helpers/utils.helper';
import { errorResponse, notFoundResponse, successResponse, validationError } from '../helpers/api_response.helper';
import Expense from '../models/expense.model';
import User from '../models/user.model';
import xlsx from 'xlsx';
const addExpense = async (req: Request, res: Response) => {
  console.log('first');
  const { amount, source, icon, date } = req.body;

  try {
    const userId = utils.getUserId(req);
    const userExistes = await User.findById(userId);
    if(!userExistes){
      return validationError(res, 'User does not exists in database');
    }
    if (!amount || !source) {
      return validationError(res, 'Missing Required Fields ');
    }

    const expenseDate = date ? new Date() : utils.getCurrentISTDate();
    const newExpense = new Expense({
      userId,
      amount,
      source,
      icon,
      date: expenseDate,
    });
    await newExpense.save();
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getAllExpense = async (req: Request, res: Response) => {
  try {
     const userId = await utils.getUserId(req)
    console.log(userId);
    const userExistes = await Expense.findOne(userId);
    if(!userExistes){
      return validationError(res, 'user does not existes in database');
    }
    const allExpenses = await Expense.find({});
    if(!allExpenses){
      return notFoundResponse(res, 'No expense Found');
    }

    return successResponse(res, 'all response Found', allExpenses);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {
    
     const userId = await utils.getUserId(req)
     const userExistes = await User.findById(userId);
     if(!userExistes){
      return notFoundResponse(res, 'user does not exists in database');
     }
     const deleteExpense = await Expense.findByIdAndDelete(req.params.id);
     return successResponse(res, 'Expense deleted successfully', deleteExpense);
  } catch (error) {}
};
const downloadExpense = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req)
    const userExists = await User.findById(userId);
    if(!userExists){
      return validationError(res, 'User not found in the database');
    }
    const expense = await Expense.find({userId}).sort({date:-1});
    const data = expense.map((item)=>({
      Source: item.source,
      Amount : item.amount,
      date: item.date      
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'expense')
    xlsx.writeFile(wb, `expense-details ${userExists.firstName}.xlsx`);
    res.download(`expense-details ${userExists.firstName}.xlsx`)
  } catch (error :any) {
    return errorResponse(res, error.message)
  }
};

export default {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpense,
};
