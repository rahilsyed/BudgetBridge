import { Router } from "express";
import userRouter from "./user";
import incomeRouter from "./income";
import expenseRouter from "./expense";
import bankAccountRouter from "./bankaccount";

const router = Router();

router.use("/user", userRouter);
router.use("/income", incomeRouter);
router.use("/expense", expenseRouter);
router.use("/bankaccount", bankAccountRouter);

export default router;