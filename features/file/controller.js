import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
} from '../../utils/helpers.js';
import { toNumber } from '../../utils/index.js';

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

// optimizations

export const getFilesInFolder = async (req, res, next) => {
  const folderId = toNumber(req.params.id);

  const files = await prisma.file.findMany({
    where: {
      folderId,
    },
  });

  res.status(StatusCodes.OK).json({
    files,
  });
};

export const postFile = async (req, res, next) => {
  if (!req.file) {
    throw new BadRequestError('no file attached');
  }

  const data = {
    userId: req.user.id,
    url: req.file?.path,
    folderId: req.body.folderId,
    categoryId: req.body.categoryId,
  };

  const file = await prisma.file.create({ data });

  res.status(StatusCodes.CREATED).json({
    message: 'file created',
    file,
  });
};

export const deleteFile = async (req, res, next) => {
  const fileId = toNumber(req.params.id);

  await prisma.file.findUniqueOrThrow({
    where: {
      id: fileId,
    },
  });

  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
};
