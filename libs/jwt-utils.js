import jwt from 'jsonwebtoken';

export const generateToken = (payload, options) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
