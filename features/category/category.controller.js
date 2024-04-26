import { StatusCodes } from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';

export const getCategories = async (req, res, next) => {
  const categories = await prisma.category.findMany();

  res.status(StatusCodes.OK).json({
    categories,
  });
};

export const postCategory = async (req, res, next) => {
  const category = await prisma.category.create({
    data: req.bod,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'category created',
    category,
  });
};

export const patchCategory = async (req, res, next) => {
  const categoryId = toNumber(req.params.id);

  const data = req.body;

  // enuser that service exits
  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });

  res.status(StatusCodes.OK).json({
    message: 'updated successfully',
    category: updatedCategory,
  });
};

export const deleteCategory = async (req, res, next) => {
  const categoryId = toNumber(req.params.id);

  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};
