import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../../libs/bcrypt.js';
import {
  STATUS,
  accountDataToSelect,
  fileDataToSelect,
} from '../../libs/constants.js';
import {
  EmployeeSchema,
  UpdateEmployeeSchema,
} from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  getUrl,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';
import { MESSAGES } from '../../utils/messages.js';

export const getEmployeeRoles = async (req, res, next) => {
  const roles = await prisma.employeeRole.findMany();

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    roles,
  });
};

export const getEmployees = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { search, status } = req.query;
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const filter = {
    AND: [
      {
        OR: [
          {
            branchId,
          },
          {
            team: {
              branchId,
            },
          },
        ],
      },
    ],
  };

  if (status) {
    // @ts-ignore
    filter.AND.push({
      account: {
        status,
      },
    });
  }

  if (search) {
    const orFilter = ['title', 'firstName', 'lastName', 'personalNumber'].map(
      (key) => ({
        [key]: {
          contains: search,
        },
      })
    );

    orFilter.push({
      // @ts-ignore
      account: {
        userNameOrEmail: {
          contains: search,
        },
      },
    });

    // @ts-ignore
    filter.AND.push({
      // @ts-ignore
      OR: orFilter,
    });
  }

  const data = await getPagination('employee', page, limit, filter, {
    include: {
      account: {
        select: accountDataToSelect,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const getEmployeeById = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const employee = await prisma.employee.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      account: {
        select: accountDataToSelect,
      },
      branch: true,
      role: true,
      team: true,
      leadingTeam: true,
      workingPapers: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    employee,
  });
};

export const postEmployee = async (req, res, next) => {
  const {
    account: { userNameOrEmail, password },
    branchId,
    teamId,
    roleId,
    ...data
  } = validateJoi(EmployeeSchema, req.body);

  const isUserNameExists = await prisma.acccount.findUnique({
    where: {
      userNameOrEmail,
    },
  });

  if (isUserNameExists) {
    throw new BadRequestError(MESSAGES.EMAIL_EXISTS);
  }

  const files =
    req.files?.map((f) => {
      return {
        url: getUrl(req, f.path),
      };
    }) ?? [];

  if (teamId) {
    data.team = {
      connect: {
        id: teamId,
      },
    };
  }

  if (roleId) {
    data.role = {
      connect: {
        id: roleId,
      },
    };
  }

  const hashedPassword = await hashPassword(password);

  const employee = await prisma.employee.create({
    data: {
      account: {
        create: {
          userNameOrEmail,
          hashedPassword,
        },
      },
      branch: {
        connect: {
          id: branchId,
        },
      },
      workingPapers: {
        createMany: {
          data: files,
        },
      },
      ...data,
    },
    include: {
      account: {
        select: accountDataToSelect,
      },
      branch: true,
      team: true,
      workingPapers: {
        select: fileDataToSelect,
      },
      role: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    employee,
  });
};

export const patchEmployee = async (req, res, next) => {
  const id = toNumber(req.params.id);
  const {
    account: { userNameOrEmail, password, status },
    branchId,
    teamId,
    roleId,
    ...data
  } = validateJoi(UpdateEmployeeSchema, req.body);

  const oldEmployee = await prisma.employee.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (userNameOrEmail) {
    const isUserNameExists = await prisma.acccount.findUnique({
      where: {
        userNameOrEmail,
      },
    });

    if (isUserNameExists) {
      throw new BadRequestError(MESSAGES.EMAIL_EXISTS);
    }
  }

  const files =
    req.files?.map((f) => {
      return {
        url: getUrl(req, f.path),
      };
    }) ?? [];

  if (teamId) {
    data.team = {
      connect: {
        id: teamId,
      },
    };
  }

  if (roleId) {
    data.role = {
      connect: {
        id: roleId,
      },
    };
  }
  if (branchId) {
    data.branch = {
      connect: {
        id: branchId,
      },
    };
  }

  if (files?.length) {
    data.workingPapers = {
      createMany: {
        data: files,
      },
    };
  }
  const account = {};

  if (userNameOrEmail) {
    account.userNameOrEmail = userNameOrEmail;
  }
  if (status) {
    account.status = status;
  }

  if (password) {
    account.hashedPassword = await hashPassword(password);
  }

  const employee = await prisma.employee.update({
    where: { id },
    data: {
      account: {
        update: {
          data: {
            ...account,
          },
        },
      },
      ...data,
    },
    include: {
      account: {
        select: accountDataToSelect,
      },
      branch: true,
      team: true,
      workingPapers: {
        select: fileDataToSelect,
      },
      role: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.UPDATED,
    employee,
  });
};

export const deleteEmployee = async (req, res, next) => {
  const id = toNumber(req.params.id);

  await prisma.employee.findUniqueOrThrow({
    where: { id },
  });

  await prisma.employee.delete({
    where: { id },
  });

  await prisma.acccount.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};
