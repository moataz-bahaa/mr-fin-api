import prisma from '../../prisma/client.js';
import { formateEmployee } from '../employee/employee.service.js';

export const getUserById = (accountId) =>
  prisma.account.findUniqueOrThrow({ where: { id: accountId } });

export const setUserIsOnline = (userId, value) =>
  prisma.account.update({
    where: {
      id: userId,
    },
    data: {
      isOnline: value,
    },
  });

export const AuthService = {
  async getMe(accountId) {
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: accountId,
      },
      include: {
        admin: true,
        client: {
          include: {
            files: true,
            team: true,
          },
        },
        employee: {
          include: {
            role: true,
            team: true,
            workingPapers: true,
            leadingTeam: true,
          },
        },
      },
    });

    const role = account.admin
      ? 'admin'
      : account.client
      ? 'client'
      : account.employee.roleId === 1
      ? 'branch-manager'
      : account.employee.roleId === 2
      ? 'team-leader'
      : 'employee';

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
        email: account.email,
        status: account.status,
        isOnline: account.isOnline,
        lastLoginAt: account.lastLoginAt,
        logoutAt: account.logoutAt,
        profileImageUrl: account.profileImageUrl
      },
      userData:
        account.admin ?? formateEmployee(account.employee) ?? account.client,
      branches,
    };
  },
};
