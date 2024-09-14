import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import { clearFiles } from '../../libs/upload.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
} from '../../utils/helpers.js';
import { toNumber } from '../../utils/index.js';
import { MESSAGES } from '../../utils/messages.js';

export const getClientFiles = async (req, res, next) => {
  const clientId = toNumber(req.params.clientId);
  const { serviceId } = req.query;
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const data = await getPagination(
    'file',
    page,
    limit,
    {
      serviceId: serviceId ? toNumber(serviceId) : undefined,
      OR: [
        {
          clientId,
        },
        {
          userId: clientId,
        },
      ],
    },
    {
      select: {
        id: true,
        url: true,
        service: true,
        createdAt: true,
        updatedAt: true,
      },
    }
  );

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const deleteUserFile = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const file = await prisma.file.findUniqueOrThrow({
    where: { id },
  });

  await prisma.file.delete({
    where: { id },
  });

  clearFiles(file.url);

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};
