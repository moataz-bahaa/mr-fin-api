import { Router } from 'express';
import {
  postChangePassword,
  postSignin,
  postForgetPassword,
} from './user.controller.js';

const router = Router();

router.post('/signin', postSignin);

router.post('/change-password', postChangePassword);

router.post('/forget-password', postForgetPassword);

export default router;
