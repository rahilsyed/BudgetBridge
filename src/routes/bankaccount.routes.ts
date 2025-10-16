import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import bankAccountController from "../controllers/bankAccount.controller";
const router = Router();

router.get('/get',authenticate as any, bankAccountController.getAccounts as any);
router.get('/get/:id',authenticate as any, bankAccountController.getAccount as any);
router.post('/add', authenticate as any, bankAccountController.addAccount as any);
router.put('/update', authenticate);


export default router;