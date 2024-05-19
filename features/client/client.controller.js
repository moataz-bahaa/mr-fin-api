import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../../libs/bcrypt.js';
import {
  STATUS,
  accountDataToSelect,
  fileDataToSelect,
} from '../../libs/constants.js';
import { ClientSchema, UpdateClientSchema } from '../../libs/joi-schemas.js';
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

export const getClients = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { search, status } = req.query;
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const filter = {
    branchId,
  };

  if (status) {
    filter.account = {
      status,
    };
  }

  if (search) {
    filter.OR = [
      'anrede',
      'title',
      'name',
      'vomame',
      'postleitzahlOrt',
      'landLaenderkuerzel',
      'birthName',
    ].map((key) => ({
      [key]: {
        contains: search,
      },
    }));

    filter.OR.push({
      // @ts-ignore
      account: {
        email: {
          contains: search,
        },
      },
    });
  }

  const data = await getPagination('client', page, limit, filter, {
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

export const getClientById = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const client = await prisma.client.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      account: {
        select: accountDataToSelect,
      },
      branch: true,
      services: true,
      team: true,
      files: {
        select: fileDataToSelect,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    client,
  });
};

export const postClient = async (req, res, next) => {
  const {
    account: { email, password },
    branchId,
    teamId,
    ...data
  } = validateJoi(ClientSchema, req.body);

  const isUserNameExists = await prisma.acccount.findUnique({
    where: {
      email,
    },
  });

  if (isUserNameExists) {
    throw new BadRequestError(MESSAGES.EMAIL_EXISTS);
  }

  const files =
    req.files?.files?.map((f) => {
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

  const hashedPassword = await hashPassword(password);

  const client = await prisma.client.create({
    data: {
      account: {
        create: {
          email,
          hashedPassword,
          profileImageUrl
        },
      },
      branch: {
        connect: {
          id: branchId,
        },
      },
      files: {
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
      services: true,
      files: {
        select: fileDataToSelect,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.CREATED,
    client,
  });
};

export const patchClient = async (req, res, next) => {
  const id = toNumber(req.params.id);
  const {
    account: { email, password, status },
    branchId,
    teamId,
    ...data
  } = validateJoi(UpdateClientSchema, req.body);

  const oldClient = await prisma.client.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (email) {
    const isUserNameExists = await prisma.acccount.findUnique({
      where: {
        email,
      },
    });

    if (isUserNameExists && isUserNameExists.id !== oldClient.id) {
      throw new BadRequestError(MESSAGES.EMAIL_EXISTS);
    }
  }

  const files =
    req.files?.files?.map((f) => {
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

  if (branchId) {
    data.branch = {
      connect: {
        id: branchId,
      },
    };
  }

  if (files?.length) {
    data.files = {
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

  const client = await prisma.client.update({
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
      services: true,
      files: {
        select: fileDataToSelect,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.UPDATED,
    client,
  });
};

export const deleteClient = async (req, res, next) => {
  const id = toNumber(req.params.id);

  await prisma.client.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await prisma.client.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.DELETED,
  });
};

export const postAssignToTeam = async (req, res, next) => {
  // includes adding work/serversice/requiremenst (8 services)
};
