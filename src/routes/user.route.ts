import { Router } from 'express';
import { register, login, resetPassword, getUserInfo } from '../cotrollers/user.controller';
import { authenticate } from '../middleware/authenticate.middleware';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/resetpassword', resetPassword);
router.get('/userInfo',authenticate, getUserInfo)
export default router;
