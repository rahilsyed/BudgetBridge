import { Router } from 'express';
import {register, login, resetPassword, getUserInfo, forgetPassword} from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate.middleware';
const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.put('/resetpassword', resetPassword as any);
router.get('/userInfo',authenticate as any, getUserInfo as any);
router.post('/forgetpassword', forgetPassword as any)
export default router;
