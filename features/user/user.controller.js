import prisma from '../../prisma/client.js';
import {
  BadRequestError,
  ForbidenError,
  NotFoundError,
  UnAuthenticatedError,
} from '../../utils/errors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../../libs/bcrypt.js';
import { getUserById } from './user.service.js';
import { StatusCodes } from 'http-status-codes';

export const postSignin = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.hashedPassword);

  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  const newToken = jwt.sign({ userId: user.id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: '5h',
  });

  const updatedTokens = [...user.tokens, newToken];

  await prisma.user.update({
    where: { id: user.id },
    data: { tokens: { set: updatedTokens } },
  });

  res.status(StatusCodes.OK).json({ token: newToken });
};

export const postChangePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { oldPassword, newPassword } = req.body;

  const user = await getUserById(userId);

  if (!user) {
    throw new BadRequestError('user not found');
  }

  const isPasswordValid = await comparePassword(
    oldPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) {
    throw new BadRequestError('Invalid old password');
  }

  const newHashedPassword = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { hashedPassword: newHashedPassword },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password changed successfully', updatedUser });
};

export const postForgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFoundError('user not found');
  }

  const resetToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: '1h',
    }
  );

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetToken}`,
  };

  await transporter.sendMail(mailOptions);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password reset instructions sent to your email' });
};

// TODO: review
export const logout = async (req, res) => {
  const tokenToLogout = req.body.token;

  const decodedToken = jwt.verify(tokenToLogout, process.env.JWT_PRIVATE_KEY);
  const userId = decodedToken.userId;

  const user = await getUserById(userId);

  const updatedTokens = user.tokens.filter((token) => token !== tokenToLogout);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { tokens: { set: updatedTokens } },
  });

  res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
};
