import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';
import { MESSAGES } from '../../utils/messages.js';

export const getServices = async (req, res, next) => {
  const services = await prisma.service.findMany();

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    services,
  });
};

export const postService = async (req, res, next) => {
  const service = await prisma.service.create({
    data: req.body,
  });

  res.status(StatusCodes.CREATED).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.CREATED,
    service,
  });
};

export const patchService = async (req, res, next) => {
  const serviceId = toNumber(req.params.id);

  const data = req.body;

  console.log({ data });

  // enuser that service exits
  await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });

  const updatedService = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.UPDATED,
    service: updatedService,
  });
};

export const deleteService = async (req, res, next) => {
  const serviceId = toNumber(req.params.id);

  await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });

  await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};
