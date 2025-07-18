export const gendersEnum = ['male', 'female'];

export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export const accountDataToSelect = {
  id: true,
  email: true,
  profileImageUrl: true,
  status: true,
  isOnline: true,
  lastLoginAt: true,
  logoutAt: true,
};

export const fileDataToSelect = {
  id: true,
  url: true,
  createdAt: true,
  updatedAt: true,
};

export const employeeFieldsToSelectWithoutAccount = {
  id: true,
  firstName: true,
  lastName: true,
  personalNumber: true,
  title: true,
  salutation: true,
  phone: true,
  username: true,
  gender: true,
};
export const clientFieldsToSelectWithoutAccount = {
  id: true,
  salutation: true,
  name: true,
  username: true,
  companyName: true,
  phoneLandline: true,
  phoneMobile: true,
  gender: true,
  maidenName: true,
};

export const employeeDataToSelect = {
  ...employeeFieldsToSelectWithoutAccount,
  account: {
    select: accountDataToSelect,
  },
};

export const clientDataToSelect = {
  ...clientFieldsToSelectWithoutAccount,
  account: {
    select: accountDataToSelect,
  },
};
