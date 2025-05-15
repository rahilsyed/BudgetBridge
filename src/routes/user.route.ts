import {  Router } from 'express';
import userController from "../cotrollers/user.controller";

const router = Router();

router.get("/login", userController.login);


export default router;