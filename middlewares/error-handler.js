import { StatusCodes } from 'http-status-codes';

// regex to match prisma not found error
const regex = /No\s+(\w+)\s+found/;

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const isPrismaNotFoundError = regex.test(err.message);
  if (isPrismaNotFoundError) {
    err.statusCode = StatusCodes.NOT_FOUND;
  }
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const defaultError = {
    status: 'error',
    message: err.message ?? 'Internal server error',
  };

  res.status(statusCode).json(defaultError);
};

export default errorHandler;
