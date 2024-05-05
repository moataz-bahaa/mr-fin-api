import { ForbidenError } from '../utils/errors.js';

export const APIKeyGuard = async (req, res, next) => {
  const key = req.headers['api-key'];

  if (key !== process.env.API_KEY) {
    throw new ForbidenError(
      'invalid api-key, please contact the backend developer to get a valid api-key'
    );
  }

  next();
};
