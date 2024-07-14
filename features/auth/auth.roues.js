import { Router } from 'express';
import { isAuth } from '../../middlewares/auth.middleware.js';
import {
  getMe,
  getMyContacts,
  getUsers,
  postChangePassword,
  postLogin,
} from './auth.controller.js';

const router = Router();

router.post('/login', postLogin);

router.get('/me', isAuth, getMe);

router.get('/my-contacts', isAuth, getMyContacts);

router.get('/search/:branchId', isAuth, getUsers);

router.post('/change-password', postChangePassword);

export default router;
