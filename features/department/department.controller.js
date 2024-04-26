import prisma from '../../prisma/client.js';
import {
  BadRequestError,
  ForbidenError,
  NotFoundError,
  UnAuthenticatedError,
} from '../../utils/errors.js';

export const getDepartments = async (req, res, next) => {
  const departments = await prisma.department.findMany({
    include: {
      employees: true,
    },
  });
  res.status(200).json(departments);
};

export const postDepartment = async (req, res, next) => {
  const { name } = req.body;
  const { managerId } = req.body;

  const department = await prisma.department.create({
    data: {
      name,
      managerId,
    },
  });
  res.status(201).json(department);
};

export const patchDepartment = async (req, res, next) => {
  const { id } = req.params;
  const { managerId } = req.body;

  const department = await prisma.department.update({
    where: { id: parseInt(id) },
    data: {
      manager: {
        connect: { id: managerId },
      },
    },
  });

  res.status(200).json(department);
};

export const deleteDepartment = async (req, res, next) => {
  const { id } = req.params;

  await prisma.department.findUniqueOrThrow({
    where: { id: parseInt(id) },
  });

  await prisma.department.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
};

export const addEmployeesToDepartment = async (req, res, next) => {
  const { id } = req.params;
  const { employeeIds } = req.body;

  const department = await prisma.department.update({
    where: { id: parseInt(id) },
    data: {
      employees: {
        connect: employeeIds.map((employeeId) => ({ id: employeeId })),
      },
    },
  });

  res.status(200).json(department);
};

export const deleteEmployeesFromDepartment = async (req, res, next) => {
  const { id } = req.params;
  const { employeeIds } = req.body;

  const department = await prisma.department.update({
    where: { id: parseInt(id) },
    data: {
      employees: {
        disconnect: employeeIds.map((employeeId) => ({ id: employeeId })),
      },
    },
  });

  res.status(200).json(department);
};
