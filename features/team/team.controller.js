import { StatusCodes } from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';

export const getTeams = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);

  const teams = await prisma.team.findMany({
    where: {
      branchId,
    },
  });

  res.status(StatusCodes.OK).json({
    teams,
  });
};

export const postTeam = async (req, res, next) => {
  const team = await prisma.team.create({
    data: req.bod,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'teaam created',
    team,
  });
};

export const patchTeam = async (req, res, next) => {
  const teamId = toNumber(req.params.teamId);

  const data = req.body;

  // enuser that team exits
  await prisma.team.findUniqueOrThrow({
    where: {
      id: teamId,
    },
  });

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data,
  });

  res.status(StatusCodes.OK).json({
    message: 'updated successfully',
    team: updatedTeam,
  });
};

export const deleteTeam = async (req, res, next) => {
  const teamId = toNumber(req.params.teamId);

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
};

export const addEmployeesToTeam = async (req, res, next) => {
  const employees = req.body.employees,
    teamId = req.body.teamId;

  const team = await prisma.team.findUniqueOrThrow({ where: { id: teamId } });

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      employees: {
        connect: employees.map((id) => ({ id })),
      },
    },
    include: {
      employees: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'employees added successfully',
    team: updatedTeam,
  });
};

export const deleteEmployeesFromTeam = async (req, res, next) => {
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
    include: {
      employees: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'employees removed successfully',
    team: updatedTeam,
  });
};
