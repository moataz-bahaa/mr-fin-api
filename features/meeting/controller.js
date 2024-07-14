import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
} from '../../utils/helpers.js';

export const getMeetings = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const { search, type } = req.query;

  const andFilter = [];

  if (search) {
    andFilter.push({
      OR: [
        {
          accounts: {
            some: {
              email: {
                contains: search,
              },
            },
          },
        },
        {
          accounts: {
            some: {
              client: {
                name: {
                  contains: search,
                },
              },
            },
          },
        },
        {
          accounts: {
            some: {
              employee: {
                firstName: {
                  contains: search,
                },
              },
            },
          },
        },
        {
          accounts: {
            some: {
              employee: {
                lastName: {
                  contains: search,
                },
              },
            },
          },
        },
      ],
    });
  }

  if (type === 'employee') {
    andFilter.push({
      accounts: {
        some: {
          employee: {
            isNot: null,
          },
        },
      },
    });
  } else if (type === 'client') {
    andFilter.push({
      accounts: {
        some: {
          client: {
            isNot: null,
          },
        },
      },
    });
  }

  const data = await getPagination(
    'meeting',
    page,
    limit,
    {
      AND: [
        {
          accounts: {
            some: {
              id: req.account.id,
            },
          },
        },
        ...andFilter,
      ],
    },
    {
      include: {
        accounts: {
          include: {
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
            admin: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }
  );

  data.meetings = data.meetings.map((meeting) => {
    return {
      ...meeting,
      accounts: undefined,
      users: meeting.accounts.map((account) => {
        const role = account.admin
          ? 'admin'
          : account.employee
          ? 'employee'
          : 'client';

        let userData = {};
        if (role === 'admin') {
          userData = {
            name: account.admin?.name,
          };
        } else if (role === 'employee') {
          userData = {
            name: `${account.employee?.firstName} ${account.employee?.lastName}`,
          };
        } else {
          userData = {
            name: account.client?.name,
          };
        }

        return {
          id: account.id,
          role,
          email: account.email,
          status: account.status,
          isOnline: account.isOnline,
          lastLoginAt: account.lastLoginAt,
          loginAt: account.loginAt,
          profileImageUrl: account.profileImageUrl,
          ...userData,
        };
      }),
    };
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};
