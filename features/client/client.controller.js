import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../../libs/bcrypt.js';
import {
  STATUS,
  accountDataToSelect,
  clientDataToSelect,
  fileDataToSelect,
} from '../../libs/constants.js';
import {
  ClientSchema,
  ClientServicesSchema,
  UpdateClientSchema,
} from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import {
  getNextNMonths,
  getPageAndLimitFromQurey,
  getPagination,
  getUrl,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';
import { MESSAGES } from '../../utils/messages.js';

export const getClients = async (req, res, next) => {
  const branchId = toNumber(req.params.branchId);
  const { search, status, teamId } = req.query;
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const filter = {
    branchId,
  };

  if (status) {
    filter.account = {
      status,
    };
  }

  if (teamId) {
    filter.teamId = toNumber(teamId);
  }

  if (search) {
    filter.OR = [
      'salutation',
      'title',
      'name',
      'username',
      'companyName',
      'abbreviation',
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
      tasks: {
        select: {
          id: true,
          service: true,
          isCompleted: true,
          months: true,
        },
      },
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
    filesServiceId,
    ...data
  } = validateJoi(ClientSchema, req.body);

  const isUserNameExists = await prisma.account.findUnique({
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
        serviceId: filesServiceId,
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
          profileImageUrl,
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
    filesServiceId,
    ...data
  } = validateJoi(UpdateClientSchema, req.body);

  const oldClient = await prisma.client.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (email) {
    const isUserNameExists = await prisma.account.findUnique({
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
        serviceId: filesServiceId,
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

export const putClientServices = async (req, res, next) => {
  const servicesIds = validateJoi(ClientServicesSchema, req.body);

  const id = toNumber(req.params.id);
  const client = await prisma.client.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });

  for (const serviceId of servicesIds) {
    const isExists = await client.services.find((s) => s.id === serviceId);

    if (isExists) {
      // if it is exists cron job will handle re adding client-services
      continue;
    }

    await prisma.client.update({
      where: {
        id: client.id,
      },
      data: {
        services: {
          connect: {
            id: serviceId,
          },
        },
      },
    });

    const service = await prisma.service.findUniqueOrThrow({
      where: {
        id: serviceId,
      },
    });

    const months = getNextNMonths(service.repeatedEvery ?? 0);

    console.log({ 
      ...service,
      months,
    })

    // add task
    await prisma.task.create({
      data: {
        clientId: client.id,
        serviceId,
        months,
      },
    });
  }

  // handle deletion
  const servicesToDelete = [];
  for (const service of client.services) {
    if (!servicesIds.includes(service.id)) {
      servicesToDelete.push({ id: service.id });
    }
  }

  await prisma.client.update({
    where: {
      id: client.id,
    },
    data: {
      services: {
        disconnect: servicesToDelete,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
  });
};

export const getClientOrdersDetails = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const client = await prisma.client.findUniqueOrThrow({
    where: { id },
    include: {
      services: true,
    },
  });

  const services = client.services;

  for (const service of services) {
    const total = await prisma.invoiceItem.aggregate({
      where: {
        invoice: {
          clientId: client.id,
        },
        serviceId: service.id,
      },
      _sum: {
        amount: true,
        price: true,
      },
    });

    // @ts-ignore
    service.totalPrice = (total._sum.price ?? 0) * (total._sum.amount ?? 0);
  }

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    services,
  });
};

export const getClientServices = async (req, res, next) => {
  const id = toNumber(req.params.id);
  const client = await prisma.client.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      ...clientDataToSelect,
      services: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    services: client.services,
  });
};

export const getClientSummry = async (req, res, next) => {
  // TODO client oders summry
  /**
   * part 2 (right side)
   * get tota of
   * 1. monthly services
   * 2. annaul services
   * 3. one-off services
   *
   * tota of 1 + 2 + 3
   */
  /**
   * part 2 left side
   *
   * check
   * https://www.figma.com/design/98C7dz8DKuIlhkJGXRfTnN/standared-map?node-id=93-1239&t=nFS7eOyQfuW6Upu1-4
   */
};
