import { Router } from 'express';
import incomeController from '../controllers/income.controller';
import { authenticate } from '../middleware/authenticate.middleware';
const   router = Router();

router.post('/add-income', authenticate as any,incomeController.addIncome as any);
router.get('/get-incomes',authenticate as any , incomeController.getAllIncomes as any);
router.post('/download-xcel',authenticate as any, incomeController.downloadExcel as any);
router.delete('/delete-income/:id',authenticate as any, incomeController.deleteIncome as any);


export default router;