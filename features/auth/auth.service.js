import prisma from '../../prisma/client.js';

export const getUserById = (accountId) =>
  prisma.acccount.findUniqueOrThrow({ where: { id: accountId } });

export const setUserIsOnline = (userId, value) =>
  prisma.acccount.update({
    where: {
      id: userId,
    },
    data: {
      isOnline: value,
    },
  });

export const AuthService = {
  async getMe(accountId) {
    const account = await prisma.acccount.findUniqueOrThrow({
      where: {
        id: accountId,
      },
      include: {
        admin: true,
        client: true,
        employee: true,
      },
    });

    const role = account.admin
      ? 'admin'
      : account.employee
      ? 'employee'
      : 'client';

    let orFilter = [];

    if (account.admin) {
      orFilter = undefined;
    }

    if (account.client) {
      orFilter.push({
        clients: {
          some: {
            id: account.id,
          },
        },
      });
    }

    if (account.employee) {
      orFilter.push({
        employees: {
          some: {
            id: account.id,
          },
        },
      });
      orFilter.push({
        managerId: account.id,
      });

      orFilter.push({
        teams: {
          some: {
            employees: {
              some: {
                id: account.id,
              },
            },
          },
        },
      });
    }

    const branches = await prisma.branch.findMany({
      where: {
        OR: orFilter,
      },
    });

    return {
      role,
      account: {
        id: account.id,
        userNameOrEmail: account.userNameOrEmail,
        status: account.status,
        isOnline: account.isOnline,
        lastLoginAt: account.lastLoginAt,
        logoutAt: account.logoutAt,
      },
      userData: account.admin ?? account.employee ?? account.client,
      branches,
    };
  },
};
