import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import { BranchSchema, UpdateBranchSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import { toNumber, validateJoi } from '../../utils/helpers.js';
import { MESSAGES } from '../../utils/messages.js';

export const postBranch = async (req, res, next) => {
  const data = validateJoi(BranchSchema, req.body);
  const branch = await prisma.branch.create({
    data,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    branch,
  });
};

export const patchBranch = async (req, res, next) => {
  const id = toNumber(req.params.id);
  const data = validateJoi(UpdateBranchSchema, req.body);

  if (data.managerId) {
    const employee = await prisma.employee.findUniqueOrThrow({
      where: {
        id: data.managerId,
      },
    });

    if (employee.branchId !== id) {
      throw new BadRequestError(
        MESSAGES.EMPLOYEE_CAN_NOT_BE_MANGER
      );
    }

    if (employee.roleId !== 1) {
      throw new BadRequestError(MESSAGES.ROLE_MUST_BE_BRANCH_MANAGER);
    }

    await prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        managedBranch: {
          connect: {
            id,
          },
        },
      },
    });
  }

  const branch = await prisma.branch.update({
    where: {
      id,
    },
    data,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    branch,
  });
};

export const deleteBranch = async (req, res, next) => {
  const id = toNumber(req.params.id);

  await prisma.branch.findUniqueOrThrow({
    where: { id },
  });

  await prisma.branch.delete({
    where: { id },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};
