import { Router } from 'express';
import incomeController from '../controllers/income';
import { authenticate } from '../middleware/authenticate';
const   router = Router();

router.post('/add-income', authenticate ,incomeController.addIncome );
router.get('/get-incomes',authenticate , incomeController.getAllIncomes );
router.post('/download-xcel',authenticate , incomeController.downloadExcel );
router.delete('/delete-income/:id',authenticate , incomeController.deleteIncome );


export default router;