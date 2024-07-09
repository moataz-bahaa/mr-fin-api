import { Router } from 'express';
import { isAuth } from '../../middlewares/auth.middleware.js';
import {
  getMe,
  getUsers,
  postChangePassword,
  postForgetPassword,
  postLogin,
} from './auth.controller.js';

const router = Router();

router.post('/login', postLogin);

router.get('/me', isAuth, getMe);

router.get('/search/:branchId', getUsers);

router.post('/change-password', postChangePassword);

router.post('/forget-password', postForgetPassword);

export default router;
