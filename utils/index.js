import { BadRequestError } from './errors.js';
import { MESSAGES } from './messages.js';

export const toNumber = (value) => {
  const number = +value;

  if (isNaN(number)) {
    throw new BadRequestError(MESSAGES.INCORRECT_NUMBER);
  }

  return number;
};

export const calcNumberOfPages = (totalCount, count) =>
  Math.ceil(totalCount / count);
