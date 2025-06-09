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
const addIncome = async (req: Request, res: Response) => {
  const { icon, source, amount, date } = req.body;
  try {
    const userId = utils.getUserId(req);
      if (!source || !amount) {
      return validationError(res, 'all fields are required');
    }

    const incomeDate = date ? new Date(date) : utils.getCurrentISTDate();
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: incomeDate,
    });
    await newIncome.save();
    return successResponse(res, 'Income Added successfully', newIncome);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getAllIncomes = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req);
    
    const userIncome = await Income.find({ userId }).select(
      '-createdAt -updatedAt -__v'
    ).sort( {date : -1});

    if(!userIncome){
        return notFoundResponse(res, 'No Income Found for the current user');
    }

    return successResponse(res, 'All Incomes fetched ', userIncome)

} catch (error) {
    return errorResponse(res, error.message)
}
};
const deleteIncome = async (req: Request, res: Response) => {
  const incomeId  = req.params.id;
    try {
        if(!incomeId){
            return validationError(res, 'Missing required fields to delete an income')
        }
        const deleteIncome = await Income.findByIdAndDelete(incomeId);
        if(!deleteIncome){
            return notFoundResponse(res, "Income not found");
        }

        return successResponse(res, "Income deleted successfully", deleteIncome);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
const downloadExcel = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req);
    const income = await Income.find({ userId }).sort({ date: -1 });
    
    const data = income.map((item)=>({
        Source: item.source,
        Amount: item.amount,
        Date: item.date.toISOString(),
    }));
    console.log(data)
    const wb = xlsx.utils.book_new();
    const ws= xlsx.utils.json_to_sheet(data);
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
