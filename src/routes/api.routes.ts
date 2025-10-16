import express from "express"
import userRouter from "./user.route"
import incomeRouter from "./income.routes"
import expenseRouter from './expense.routes'
import bankAccountRouter from './bankaccount.routes';
const app =express();


app.use("/user", userRouter);
app.use("/income", incomeRouter);
app.use("/expense",expenseRouter);
app.use("/bankaccount",bankAccountRouter);

export default app;