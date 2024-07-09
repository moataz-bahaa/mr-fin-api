import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';

export const getChecklist = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);

  const filter = {
    branchId,
  };

  if (!req.account.isAdmin && !req.account.isBranchManager) {
    if (req.account.isTeamLeader) {
      const team = await prisma.team.findUnique({
        where: {
          teamLeaderId: req.account.id,
        },
      });
      if (team) {
        filter.teamId = team.id;
      } else {
        filter.id = req.account.id;
      }
    } else {
      filter.id = req.account.id;
    }
  }

  const employees = await prisma.employee.findMany({
    where: filter,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      account: {
        select: {
          id: true,
          email: true,
          profileImageUrl: true,
          status: true,
          lastLoginAt: true,
          logoutAt: true,
          isOnline: true,
        },
      },
      tasks: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    employees,
  });
};
