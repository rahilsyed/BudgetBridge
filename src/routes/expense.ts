import {Router} from 'express';
import expenseController from "../controllers/expense";
import { authenticate } from '../middleware/authenticate';



const router = Router();


router.post('/add-expense', authenticate ,expenseController.addExpense );
router.get('/get-expense',authenticate , expenseController.getAllExpense );
router.post('/download-xcel',authenticate , expenseController.downloadExpense );
router.delete('/delete-expense/:id',authenticate , expenseController.deleteExpense );

export default router