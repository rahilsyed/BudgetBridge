import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate.middleware';
const router = Router();

router.post('/register', userController.register as any);
router.post('/login', userController.login as any);
router.put('/resetpassword', userController.resetPassword as any);
router.get('/userInfo',authenticate as any, userController.getUserInfo as any);
router.post('/forgetpassword', userController.forgetPassword as any)
export default router;
