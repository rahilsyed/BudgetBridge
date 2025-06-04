import { Router } from 'express';
import userController from '../cotrollers/user.controller';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;
