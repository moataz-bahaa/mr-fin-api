import { Router } from 'express';
import {
  getMe,
  postChangePassword,
  postForgetPassword,
  postLogin,
} from './auth.controller.js';
import { isAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', postLogin);

router.get('/me', isAuth, getMe)

router.post('/change-password', postChangePassword);

router.post('/forget-password', postForgetPassword);

export default router;
