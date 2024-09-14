import { ForbidenError } from '../utils/errors.js';
import { MESSAGES } from '../utils/messages.js';

export const APIKeyGuard = async (req, res, next) => {
  const key = req.headers['api-key'];

  if (key !== process.env.API_KEY) {
    throw new ForbidenError(MESSAGES.INVALID_API_KEY);
  }

  next();
};
