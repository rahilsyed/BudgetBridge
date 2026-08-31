import { Router } from 'express';
import userController from '../controllers/user';
import { authenticate } from '../middleware/authenticate';
const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/resetpassword', userController.resetPassword);
router.get('/userInfo',authenticate, userController.getUserInfo);
router.post('/forgetpassword', userController.forgetPassword);
router.post('/initialReset',authenticate,userController.initialResetPassword)
router.get('/userData',authenticate,userController.dashboard)
export default router;
