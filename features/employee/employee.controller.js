import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../../libs/bcrypt.js';
import {
  STATUS,
  accountDataToSelect,
  clientDataToSelect,
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
import { formateEmployee } from './employee.service.js';

export const getEmployeeRoles = async (req, res, next) => {
  const roles = await prisma.employeeRole.findMany();

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    roles,
  });
};

export const getEmployees = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { search, status, teamId, excludedTeamId } = req.query;
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
          {
            leadingTeam: {
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
        email: {
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

  if (teamId) {
    filter.AND.push({
      OR: [
        {
          // @ts-ignore
          teamId: +teamId,
        },
        {
          // @ts-ignore
          leadingTeam: {
            id: +teamId,
          },
        },
      ],
    });
  }

  if (excludedTeamId) {
    filter.AND.push(
      {
        OR: [
          {
            // @ts-ignore
            teamId: {
              not: +excludedTeamId,
            },
          },
          {
            // @ts-ignore
            teamId: null,
          },
        ],
      },
      {
        OR: [
          {
            leadingTeam: {
              id: {
                not: +excludedTeamId,
              },
            },
          },
          {
            leadingTeam: null,
          },
        ],
      }
    );
  }

  const data = await getPagination('employee', page, limit, filter, {
    include: {
      team: true,
      leadingTeam: true,
      role: true,
      account: { select: accountDataToSelect },
    },
  });

  data.employees = data.employees.map(formateEmployee);

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const getEmployeeById = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const employee = await prisma.employee
    .findUniqueOrThrow({
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
        workingPapers: {
          select: fileDataToSelect,
        },
      },
    })
    .then((emp) => formateEmployee(emp));

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    employee,
  });
};

export const postEmployee = async (req, res, next) => {
  console.log(req.body);
  const {
    account: { email, password },
    branchId,
    teamId,
    roleId,
    ...data
  } = validateJoi(EmployeeSchema, req.body);

  const isUserNameExists = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  if (isUserNameExists) {
    throw new BadRequestError(MESSAGES.EMAIL_EXISTS);
  }

  const files =
    req.files?.workingPapers?.map((f) => {
      return {
        url: getUrl(req, f.path),
      };
    }) ?? [];

  const profileImage = req.files?.profileImage;
  let profileImageUrl = null;

  if (profileImage) {
    profileImageUrl = getUrl(req, profileImage?.[0]?.path);
  }

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
          email,
          hashedPassword,
          profileImageUrl,
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
    employee: formateEmployee(employee),
  });
};

export const patchEmployee = async (req, res, next) => {
  console.log('patch employee', req.body);
  const id = toNumber(req.params.id);
  const {
    account: { email, password, status },
    branchId,
    teamId,
    roleId,
    ...data
  } = validateJoi(UpdateEmployeeSchema, req.body);

  const oldEmployee = await prisma.employee.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      leadingTeam: true,
    },
  });

  if (email) {
    const isUserNameExists = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (isUserNameExists && isUserNameExists.id !== oldEmployee.id) {
      throw new BadRequestError(MESSAGES.EMAIL_EXISTS);
    }
  }

  const files =
    req.files?.workingPapers?.map((f) => {
      return {
        url: getUrl(req, f.path),
      };
    }) ?? [];

  const profileImage = req.files?.profileImage;
  let profileImageUrl = null;

  if (profileImage) {
    profileImageUrl = getUrl(req, profileImage?.[0]?.path);
  }

  if (branchId) {
    data.branch = {
      connect: {
        id: branchId,
      },
    };

    if (oldEmployee.teamId) {
      data.team = {
        disconnect: {
          id: oldEmployee.teamId,
        },
      };
    }

    if (oldEmployee.leadingTeam) {
      data.leadingTeam = {
        disconnect: {
          id: oldEmployee.leadingTeam.id,
        },
      };
    }
  }

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

  if (files?.length) {
    data.workingPapers = {
      createMany: {
        data: files,
      },
    };
  }
  const account = {};

  if (email) {
    account.email = email;
  }
  if (status) {
    account.status = status;
  }

  if (password) {
    account.hashedPassword = await hashPassword(password);
  }

  if (profileImageUrl) {
    account.profileImageUrl = profileImageUrl;
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
    employee: formateEmployee(employee),
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

  await prisma.account.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};

export const getEmployeesProductavity = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const data = await getPagination(
    'employee',
    page,
    limit,
    {
      branchId,
    },
    {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        salutation: true,
        account: {
          select: {
            ...accountDataToSelect,
          },
        },
        tasks: {
          select: {
            client: {
              select: clientDataToSelect,
            },
          },
          distinct: ['clientId'],
        },
      },
    }
  );
  // @ts-ignore
  data.employees.forEach((emp) => {
    // @ts-ignore
    emp.clientsWorkedWith = emp.tasks.flatMap((t) => t.client);
    delete emp.tasks;
  });

  // @ts-ignore
  // @ts-ignore
  for (const employee of data.employees) {
    // @ts-ignore
    for (const client of employee.clientsWorkedWith) {
      const total = await prisma.invoice.aggregate({
        where: {
          clientId: client.id,
        },
        _sum: {
          netAmount: true,
          remainingInvoiceGrossAmount: true,
        },
      });

      const monthlyServicesTotal = await prisma.invoiceItem.aggregate({
        where: {
          service: {
            repeatedEvery: 1,
          },
          invoice: {
            clientId: client.id,
          },
        },
        _sum: {
          price: true,
        },
      });
      const yearlyServicesTotal = await prisma.invoiceItem.aggregate({
        where: {
          service: {
            repeatedEvery: 12,
          },
          invoice: {
            clientId: client.id,
          },
        },
        _sum: {
          price: true,
        },
      });

      client.total = {
        ...total._sum,
        yearlServicesTotal: yearlyServicesTotal._sum.price ?? 0,
        monthlyServicesTotal: monthlyServicesTotal._sum.price ?? 0,
      };
    }
  }

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};
