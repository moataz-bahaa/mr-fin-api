import { StatusCodes } from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';

export const getFolders = async (req, res, next) => {
  const parentFolderId = toNumber(req.params.id);

  const folders = await prisma.folder.findMany({
    where: {
      parentFolderId,
    },
  });

  res.status(StatusCodes.OK).json({
    folders,
  });
};

export const postFolder = async (req, res, next) => {
  const data = req.body;

  const folder = await prisma.folder.create({
    data,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'folder created',
    folder,
  });
};

export const patchFolder = async (req, res, next) => {
  const folderId = toNumber(req.params.id);

  const data = {
    name: req.body.name,
  };

  await prisma.folder.findUniqueOrThrow({
    where: {
      id: folderId,
    },
  });

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data,
  });

  res.status(StatusCodes.OK).json({
    message: 'updated successfully',
    folder: updatedFolder,
  });
};

export const deleteFolder = async (req, res, next) => {
  const folderId = toNumber(req.params.id);

  await prisma.folder.findUniqueOrThrow({
    where: {
      id: folderId,
    },
  });

  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
};
