import {Router} from 'express';
import expenseController from "../controllers/expense.controller";
import { authenticate } from '../middleware/authenticate.middleware';



const router = Router();


router.post('/add-expense', authenticate as any,expenseController.addExpense as any);
router.get('/get-expense',authenticate as any , expenseController.getAllExpense as any);
router.post('/download-xcel',authenticate as any, expenseController.downloadExpense as any);
router.delete('/delete-expense/:id',authenticate as any, expenseController.deleteExpense as any);

export default router