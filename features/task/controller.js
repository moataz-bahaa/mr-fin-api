import { StatusCodes } from 'http-status-codes';
import {
  accountDataToSelect,
  clientDataToSelect,
  employeeDataToSelect,
  STATUS,
} from '../../libs/constants.js';
import { PatchClientService, TaskSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  validateJoi,
} from '../../utils/helpers.js';
import { toNumber } from '../../utils/index.js';
import { MESSAGES } from '../../utils/messages.js';

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
        filter.OR = [
          {
            teamId: team.id,
          },
          {
            leadingTeam: {
              id: team.id,
            },
          },
        ];
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

export const getTasks = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const { status, branchId, clientId, serviceId } = req.query; // can be all or completed

  const filter = {};

  if (req.account.isAdmin || req.account.isBranchManager) {
    if (!branchId && !clientId) {
      throw new BadRequestError(
        'For admins and branch managers branchId must be sent'
      );
    }

    if (branchId) {
      filter.employees = {
        some: {
          branchId: toNumber(branchId),
        },
      };
    }
  } else if (req.account.isTeamLeader) {
    const team = await prisma.team.findUnique({
      where: {
        teamLeaderId: req.account.id,
      },
    });
    if (team) {
      filter.employees = {
        some: {
          OR: [
            {
              teamId: team.id,
            },
            {
              leadingTeam: {
                id: team.id,
              },
            },
          ],
        },
      };
    } else {
      filter.employees = {
        some: {
          id: req.account.id,
        },
      };
    }
  } else {
    filter.employees = {
      some: {
        id: req.account.id,
      },
    };
  }

  if (status) {
    filter.isCompleted = status === 'completed';
  }

  if (clientId) {
    filter.clientId = toNumber(clientId);
  }
  if (serviceId) {
    filter.serviceId = toNumber(serviceId);
  }

  const data = await getPagination('task', page, limit, filter, {
    include: {
      service: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const getClientTasks = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const { status, serviceId } = req.query;

  const filter = {
    clientId: req.account.id,
  };

  if (status) {
    filter.isCompleted = status === 'completed';
  }

  if (serviceId) {
    filter.serviceId = toNumber(serviceId);
  }

  const data = await getPagination('task', page, limit, filter, {
    include: {
      service: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          account: {
            select: accountDataToSelect,
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const getTaskById = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const task = await prisma.task.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      service: true,
      client: {
        select: {
          id: true,
          name: true,
          account: {
            select: accountDataToSelect,
          },
        },
      },
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          account: {
            select: accountDataToSelect,
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    task,
  });
};

export const patchTasks = async (req, res, next) => {
  const tasks = validateJoi(PatchClientService, req.body);

  for (const task of tasks) {
    console.log({ task });
    await prisma.task.findUniqueOrThrow({
      where: {
        id: task.id,
      },
    });

    const data = {};

    if (task.employees) {
      data.employees = {
        set: task.employees.map((id) => ({ id })),
      };
    }

    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        isCompleted: task.isCompleted,
        ...data,
      },
    });
  }

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.UPDATED,
  });
};

export const getTeamsTasks = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { limit } = getPageAndLimitFromQurey(req.query);
  const { status } = req.query; // can be all or completed

  let filter = {};

  if (!req.account.isAdmin && !req.account.isBranchManager) {
    filter = {
      OR: [
        {
          employees: {
            some: {
              id: req.account.id,
            },
          },
        },
        {
          teamLeaderId: req.account.id,
        },
      ],
    };
  }

  const teams = await prisma.team.findMany({
    where: {
      branchId,
      ...filter,
    },
    include: {
      employees: {
        select: {
          id: true,
        },
      },
    },
  });

  console.log('teams', teams.length);

  for (const team of teams) {
    // @ts-ignore
    team.tasks = await prisma.task.findMany({
      where: {
        isCompleted: status === 'completed',
        OR: [
          {
            employees: {
              some: {
                id: {
                  in: team.employees.map((e) => e.id),
                },
              },
            },
          },
          {
            employees: {
              some: {
                id: team.teamLeaderId,
              },
            },
          },
        ],
      },
      include: {
        client: {
          select: clientDataToSelect,
        },
        employees: {
          select: employeeDataToSelect,
        },
      },
      take: limit,
    });
    team.employees = undefined;
  }

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    teams,
  });
};

export const postTask = async (req, res, next) => {
  const data = validateJoi(TaskSchema, req.body);

  data.employees = {
    connect: data.employees?.map((id) => ({ id })),
  };

  const task = await prisma.task.create({
    data,
    include: {
      client: {
        select: clientDataToSelect,
      },
      service: true,
      employees: {
        select: employeeDataToSelect,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    task,
  });
};

export const deleteTask = async (req, res, next) => {
  const id = toNumber(req.params.id);

  await prisma.task.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await prisma.task.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
  });
};
