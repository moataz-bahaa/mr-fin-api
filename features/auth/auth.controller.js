import { StatusCodes } from 'http-status-codes';
import { comparePassword, hashPassword } from '../../libs/bcrypt.js';
import { accountDataToSelect, STATUS } from '../../libs/constants.js';
import { AccountSchema } from '../../libs/joi-schemas.js';
import { generateToken } from '../../libs/jwt-utils.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';
import { AuthService, getUserById } from './auth.service.js';
import { MESSAGES } from '../../utils/messages.js';

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
    throw new BadRequestError(MESSAGES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await comparePassword(
    password,
    account.hashedPassword
  );

  if (!isPasswordValid) {
    throw new BadRequestError(MESSAGES.INVALID_CREDENTIALS);
  }

  if (account.status === 'archive') {
    throw new BadRequestError(
      MESSAGES.USER_IS_ARCHIVED_AND_CAN_NOT_LOGIN
    );
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
    throw new BadRequestError(MESSAGES.USER_NOT_FOUND);
  }

  const isPasswordValid = await comparePassword(
    oldPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) {
    throw new BadRequestError(MESSAGES.INVALID_OLD_PASSWORD);
  }

  const newHashedPassword = await hashPassword(newPassword);

  const updatedUser = await prisma.account.update({
    where: { id: userId },
    data: { hashedPassword: newHashedPassword },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY, updatedUser });
};

export const getUsers = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { search = '' } = req.query;

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
          {
            admin: {
              isNot: null
            }
          }
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

  if (req.account.client) {
    filter.AND.push({
      // @ts-ignore
      employee: {
        isNot: null,
      },
    });
  }

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

export const getMyContacts = async (req, res, next) => {
  const contacts = await prisma.account.findMany({
    where: {
      OR: [
        {
          receivedEmails: {
            some: {
              senderId: req.account?.id,
            },
          },
        },
        {
          sendedEmails: {
            some: {
              receivers: {
                some: {
                  id: req.account.id,
                },
              },
            },
          },
        },
      ],
    },
    select: {
      ...accountDataToSelect,
      admin: true,
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    contacts: contacts.map((c) => ({
      ...c,
      name:
        c.admin?.name ??
        c.client?.name ??
        `${c.employee?.firstName} ${c.employee?.lastName}`,
      admin: undefined,
      employee: undefined,
      client: undefined,
    })),
  });
};
