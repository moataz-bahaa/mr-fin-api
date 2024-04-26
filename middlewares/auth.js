import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../utils/errors.js';
import prisma from '../prisma/client.js';

const secret = process.env.JWT_PRIVATE_KEY;

export const isAuth = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    throw new UnAuthenticatedError();
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, secret);

    if (!payload) {
      throw new UnAuthenticatedError();
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new UnAuthenticatedError('invalid token');
    }

    req.user = user;
  } catch (err) {
    throw new UnAuthenticatedError();
  }
  return next();
};
