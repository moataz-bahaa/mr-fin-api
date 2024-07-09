import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../../libs/bcrypt.js';
import { accountDataToSelect, STATUS } from '../../libs/constants.js';
import { AccountSchema } from '../../libs/joi-schemas.js';
import { generateToken } from '../../libs/jwt-utils.js';
import prisma from '../../prisma/client.js';
import { sendEmail } from '../../utils/email.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';
import { AuthService, getUserById } from './auth.service.js';

export const postLogin = async (req, res) => {
  const { email, password } = validateJoi(AccountSchema, req.body);

  const account = await prisma.account.findUnique({
    where: { email },
    include: {
      admin: true,
      client: true,
      employee: true,
    },
  });

  if (!account) {
    throw new BadRequestError('invalid credentials');
  }

  const isPasswordValid = await comparePassword(
    password,
    account.hashedPassword
  );

  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      lastLoginAt: new Date().toISOString(),
    },
  });

  const token = generateToken({ id: account.id });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    token,
  });
};

export const getMe = async (req, res, next) => {
  const id = req.account.id;

  const data = await AuthService.getMe(id);

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    data,
  });
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

  const updatedUser = await prisma.account.update({
    where: { id: userId },
    data: { hashedPassword: newHashedPassword },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password changed successfully', updatedUser });
};

export const getUsers = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { search = '' } = req.query;

  console.log({ branchId });

  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const filter = {
    AND: [
      {
        OR: [
          {
            client: {
              branchId,
            },
          },
          {
            employee: {
              branchId,
            },
          },
        ],
      },
      {
        OR: [
          {
            email: {
              contains: search,
            },
          },
          {
            client: {
              name: {
                contains: search,
              },
            },
          },
          {
            employee: {
              OR: [
                {
                  firstName: {
                    contains: search,
                  },
                },
                {
                  lastName: {
                    contains: search,
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };

  const data = await getPagination('account', page, limit, filter, {
    select: {
      ...accountDataToSelect,
      admin: true,
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          personalNumber: true,
          title: true,
          salutation: true,
          phone: true,
          username: true,
          gender: true,
        },
      },
      client: {
        select: {
          id: true,
          salutation: true,
          name: true,
          username: true,
          companyName: true,
          phoneLandline: true,
          phoneMobile: true,
          gender: true,
          maidenName: true,
        },
      },
    },
  });

  data.accounts = data.accounts.map((account) => {
    return {
      ...account,
      client: undefined,
      employee: undefined,
      admin: undefined,
      name:
        account.admin?.name ??
        account?.client?.name ??
        `${account.employee?.firstName ?? ''} ${
          account.employee?.lastName ?? ''
        }`,
    };
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

// TODO optimize
export const postForgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.account.findUnique({
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

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetToken}`,
  };

  await sendEmail(mailOptions);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password reset instructions sent to your email' });
};
