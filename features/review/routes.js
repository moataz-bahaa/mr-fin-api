import { Router } from 'express';
import {
  isAdminOrBranchManager,
  isClient,
} from '../../middlewares/auth.middleware.js';
import { getReviewByClientId, getReviews, putReview } from './controller.js';

const router = Router();

router.put('/', isClient, putReview);

router.get('/:clientId', getReviewByClientId);

router.get('/', isAdminOrBranchManager, getReviews);

export default router;
