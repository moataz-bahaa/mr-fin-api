import { StatusCodes } from 'http-status-codes';
import { STATUS, accountDataToSelect } from '../../libs/constants.js';
import { TeamSchema, UpdateTeamSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import { validateJoi } from '../../utils/helpers.js';
import { toNumber } from '../../utils/index.js';
import { MESSAGES } from '../../utils/messages.js';
import { formateEmployee } from '../employee/employee.service.js';

const teamDataToInclude = {
  branch: true,
  clients: {
    include: {
      account: {
        select: accountDataToSelect,
      },
    },
  },
  teamLeader: {
    include: {
      account: {
        select: accountDataToSelect,
      },
    },
  },
  employees: {
    include: {
      account: {
        select: accountDataToSelect,
      },
    },
  },
};

export const getTeams = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);

  const teams = await prisma.team.findMany({
    where: {
      branchId,
    },
    include: {
      teamLeader: true,
      employees: {
        include: {
          account: {
            select: accountDataToSelect,
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    teams: teams.map((team) => ({
      ...team,
      employees: team.employees.map(formateEmployee),
    })),
  });
};

export const getTeamById = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const team = await prisma.team.findUniqueOrThrow({
    where: { id },
    include: {
      ...teamDataToInclude,
      clients: {
        include: {
          account: {
            select: accountDataToSelect,
          },
          tasks: {
            select: {
              id: true,
              service: true,
              isCompleted: true,
            },
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    team: {
      ...team,
      // @ts-ignore
      employees: team.employees.map(formateEmployee),
    },
  });
};

export const postTeam = async (req, res, next) => {
  const data = validateJoi(TeamSchema, req.body);

  if (data.employees) {
    data.employees = {
      connect: data.employees.map((id) => ({ id })),
    };
  }

  if (data.teamLeaderId) {
    const isExists = await prisma.team.findUnique({
      where: {
        teamLeaderId: data.teamLeaderId,
      },
    });

    if (isExists) {
      throw new BadRequestError(
        MESSAGES.employeeIsATeamLeaderInAnotherTeam(data.teamLeaderId)
      );
    }

    await prisma.employee.update({
      where: {
        id: data.teamLeaderId,
      },
      data: {
        roleId: 2,
      },
    });
  }

  const team = await prisma.team.create({
    data,
    include: teamDataToInclude,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'teaam created',
    team: {
      ...team,
      employees: team.employees.map(formateEmployee),
    },
  });
};

export const patchTeam = async (req, res, next) => {
  const teamId = toNumber(req.params.id);
  const data = validateJoi(UpdateTeamSchema, req.body);
  // enuser that team exits
  const team = await prisma.team.findUniqueOrThrow({
    where: {
      id: teamId,
    },
    include: {
      teamLeader: true,
    },
  });

  if (data.teamLeaderId) {
    await prisma.employee.update({
      where: {
        id: data.teamLeaderId,
      },
      data: {
        roleId: 2, // team-leader
        teamId: null,
        leadingTeam: {
          disconnect: true,
        },
      },
    });
  } else if (data.teamLeaderId === null && team.teamLeaderId) {
    await prisma.employee.update({
      where: {
        id: team.teamLeaderId,
      },
      data: {
        roleId: 3, // employee
        teamId: team.id,
      },
    });
  }

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data,
    include: teamDataToInclude,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.UPDATED,
    team: {
      ...updatedTeam,
      employees: updatedTeam.employees.map(formateEmployee),
    },
  });
};

export const deleteTeam = async (req, res, next) => {
  const teamId = toNumber(req.params.id);

  await prisma.team.findUniqueOrThrow({
    where: {
      id: teamId,
    },
  });

  await prisma.team.delete({
    where: {
      id: teamId,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};

export const postRemoveEmployeesFromTeam = async (req, res, next) => {
  const employees = req.body.employees,
    teamId = req.body.teamId;

  const team = await prisma.team.findUniqueOrThrow({ where: { id: teamId } });

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      employees: {
        disconnect: employees.map((id) => ({ id })),
      },
    },
    include: teamDataToInclude,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    team: {
      ...updatedTeam,
      employees: updatedTeam.employees.map(formateEmployee),
    },
  });
};

export const postAddEmployeesToTeam = async (req, res, next) => {
  const employees = req.body.employees,
    teamId = req.body.teamId;

  await prisma.team.findUniqueOrThrow({ where: { id: teamId } });

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      employees: {
        connect: employees.map((id) => ({ id })),
      },
    },
    include: teamDataToInclude,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    team: {
      ...updatedTeam,
      employees: updatedTeam.employees.map(formateEmployee),
    },
  });
};
