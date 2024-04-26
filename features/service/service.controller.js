import { StatusCodes } from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';

export const getServices = async (req, res, next) => {
  const teams = await prisma.service.findMany();

  res.status(StatusCodes.OK).json({
    teams,
  });
};

export const postService = async (req, res, next) => {
  const service = await prisma.service.create({
    data: req.bod,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'service created',
    service,
  });
};

export const patchService = async (req, res, next) => {
  const serviceId = toNumber(req.params.id);

  const data = req.body;

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
    message: 'updated successfully',
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
};
