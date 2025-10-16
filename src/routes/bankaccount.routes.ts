import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import bankAccountController from "../controllers/bankAccount.controller";
const router = Router();

router.get('/get',authenticate, bankAccountController.getAccounts);
router.get('/get/:id',authenticate, bankAccountController.getAccount);
router.post('/add', authenticate, bankAccountController.addAccount);
router.put('/update', authenticate);


export default router;