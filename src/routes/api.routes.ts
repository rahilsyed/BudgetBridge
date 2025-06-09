import express from "express"
import userRouter from "./user.route"
import incomeRouter from "./income.routes"
const app =express();


app.use("/user", userRouter)
app.use("/income", incomeRouter)


export default app;