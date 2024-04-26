import { BadRequestError } from './errors.js';

export const toNumber = (value) => {
  const number = +value;

  if (isNaN(number)) {
    throw new BadRequestError('invalid number');
  }

  return number;
};

export const calcNumberOfPages = (totalCount, count) =>
  Math.ceil(totalCount / count);
