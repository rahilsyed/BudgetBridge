import { Request, Response } from 'express';
import utils from '../helpers/utils.helper';
import { errorResponse, validationError } from '../helpers/api_response.helper';
import Expense from '../models/expense.model';

const addExpense = async (req: Request, res: Response) => {
  console.log('first');
  const { amount, category, icon, date } = req.body;

  try {
    const userId = utils.getUserId(req);
    if (!amount || !category) {
      return validationError(res, 'Missing Required Fields ');
    }

    const expenseDate = date ? new Date() : utils.getCurrentISTDate();
    const newExpense = new Expense({
      userId,
      amount,
      category,
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
  } catch (error) {}
};
const deleteExpense = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
const downloadExpense = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export default {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpense,
};
