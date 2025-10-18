import { Router } from "express";
import userRouter from "./user.route";
import incomeRouter from "./income.routes";
import expenseRouter from "./expense.routes";
import bankAccountRouter from "./bankaccount.routes";

const router = Router();

router.use("/user", userRouter);
router.use("/income", incomeRouter);
router.use("/expense", expenseRouter);
router.use("/bankaccount", bankAccountRouter);

export default router;