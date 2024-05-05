import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import { BranchSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { validateJoi } from '../../utils/helpers.js';

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
