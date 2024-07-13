import Joi from 'joi';

export const GenderSchema = Joi.string().valid('male', 'female').lowercase();

export const BranchSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().allow(''),
});

export const ForeignKeySchema = Joi.number().integer().positive();

const OptionalAccountSchema = Joi.object({
  email: Joi.string().optional().allow(''),
  password: Joi.string().optional().allow(''),
  status: Joi.string().valid('active', 'archive').optional(),
});

export const AdminSchema = Joi.object({
  name: Joi.string().required(),
  profileImageUrl: Joi.string().allow(''),
});

export const AccountSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().valid('active', 'archive').optional(),
});
export const EmployeeSchema = Joi.object({
  account: AccountSchema.required(),
  personalNumber: Joi.string().allow(''),
  salutation: Joi.string().allow(''),
  title: Joi.string().allow(''),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  street: Joi.string().allow(''),
  houseNumber: Joi.string().allow(''),
  city: Joi.string().allow(''),
  postalCode: Joi.string().allow(''),
  country: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  gender: GenderSchema,
  birthDate: Joi.date().allow(''),
  nationality: Joi.string().allow(''),
  username: Joi.string().allow(''),
  maritalStatus: Joi.string().allow(''),

  entryDate: Joi.date().allow(''),
  groupOfPeople: Joi.string().allow(''),
  jobTitle: Joi.string().allow(''),
  jobCode: Joi.string().allow(''),
  graduation: Joi.string().allow(''),
  vocationalTraining: Joi.string().allow(''),
  AUG: Joi.string().allow(''),
  contractForm: Joi.string().allow(''),
  employmentStatus: Joi.string().allow(''),
  multipleEmployment: Joi.string().allow(''),
  weeklyWorkHours: ForeignKeySchema,
  dailyWorkHours: ForeignKeySchema,

  typeOfEmployment: Joi.string().allow(''),
  taxIdentificationNumber: Joi.string().allow(''),

  healthOrLongTermInsurance: Joi.string().allow(''),
  healthInsurance: Joi.string().allow(''),
  parenthoodInPrimary: Joi.string().allow(''),
  pensionInsurance: Joi.string().allow(''),
  unemploymentInsurance: Joi.string().allow(''),
  socialSecurityNumber: Joi.string().allow(''),

  typeOfPayment: Joi.string().allow(''),
  hourWage: Joi.number().positive(),
  IBAN: Joi.string().allow(''),
  BIC: Joi.string().allow(''),

  extraInfo: Joi.string().allow(''),
  approvalForInclusionInPayroll: Joi.boolean().default(false),
  roleId: ForeignKeySchema.required(),
  branchId: ForeignKeySchema.required(),
  teamId: ForeignKeySchema.optional(),
});

export const TeamSchema = Joi.object({
  name: Joi.string().allow(''),
  teamLeaderId: ForeignKeySchema,
  branchId: ForeignKeySchema,
  employees: Joi.array().items(ForeignKeySchema),
});

export const ClientSchema = Joi.object({
  account: AccountSchema.required(),
  salutation: Joi.string().optional().allow(''),
  title: Joi.string().optional().allow(''),
  username: Joi.string().optional().allow(''),
  name: Joi.string().optional().allow(''),
  companyName: Joi.string().optional().allow(''),
  abbreviation: Joi.string().optional().allow(''),
  comment: Joi.string().optional().allow(''),

  address1: Joi.string().optional().allow(''),
  address2: Joi.string().optional().allow(''),
  zipCodeAndCity: Joi.string().optional().allow(''),
  countryCode: Joi.string().optional().allow(''),
  addressComment: Joi.string().optional().allow(''),
  phoneLandline: Joi.string().optional().allow(''),
  phoneMobile: Joi.string().optional().allow(''),
  fax: Joi.string().optional().allow(''),

  gender: Joi.string().optional().allow(''),
  maidenName: Joi.string().optional().allow(''),
  dateOfBirth: Joi.date().optional(),
  placeOfBirth: Joi.string().optional().allow(''),
  placeOfDeath: Joi.string().optional().allow(''),
  dateOfDeath: Joi.date().optional(),
  religion: Joi.string().optional().allow(''),
  federalState: Joi.string().optional().allow(''),
  maritalStatus: Joi.string().optional().allow(''),
  since: Joi.date().optional(),
  maritalPropertyRegime: Joi.string().optional().allow(''),
  unlimitedTaxLiability: Joi.boolean().optional(),
  taxation: Joi.string().optional().allow(''),
  taxIdentificationNumber: Joi.string().optional().allow(''),
  profession: Joi.string().optional().allow(''),
  employer: Joi.string().optional().allow(''),
  socialSecurityNumber: Joi.string().optional().allow(''),
  socialSecurityOrganization: Joi.string().optional().allow(''),
  IBAN: Joi.string().optional().allow(''),
  bankCustomerNumber: Joi.string().optional().allow(''),
  bankCode: Joi.string().optional().allow(''),
  taxNumber: Joi.string().optional().allow(''),
  elsterTaxNumber: Joi.string().optional().allow(''),
  deliveryAuthority: Joi.string().optional().allow(''),
  validFrom: Joi.date().optional(),
  validUntil: Joi.date().optional(),
  taxNumberComment: Joi.string().optional().allow(''),
  officialNumberName: Joi.string().optional().allow(''),
  taxOfficeDesignation: Joi.string().optional().allow(''),
  taxOfficeComment: Joi.string().optional().allow(''),
  filesServiceId: ForeignKeySchema,

  branchId: ForeignKeySchema.required(),
  teamId: ForeignKeySchema,
});

export const UpdateClientSchema = ClientSchema.keys({
  account: OptionalAccountSchema.optional().default({}),
  branchId: ForeignKeySchema,
  name: Joi.string().allow(''),
  postleitzahlOrt: Joi.string().allow(''),
  benutzername: Joi.string().allow(''),
});

export const UpdateEmployeeSchema = EmployeeSchema.keys({
  account: OptionalAccountSchema.optional().default({}),
  branchId: ForeignKeySchema,
  roleId: ForeignKeySchema,
});

export const UpdateTeamSchema = Joi.object({
  name: Joi.string().allow(''),
  teamLeaderId: ForeignKeySchema.allow(null),
  branchId: ForeignKeySchema,
});

export const UpdateBranchSchema = Joi.object({
  name: Joi.string().allow(''),
  location: Joi.string().allow(''),
  managerId: ForeignKeySchema,
});

export const AssingClientToTeamSchema = Joi.object({
  clientId: ForeignKeySchema.required(),
  teamId: ForeignKeySchema.required(),
  services: Joi.array().items(Joi.number()).default([]),
});

export const ClientServicesSchema = Joi.array().items(Joi.number()).default([]);

export const PatchClientService = Joi.array().items(
  Joi.object({
    id: Joi.number().required(),
    isCompleted: Joi.boolean().optional(),
    employees: Joi.array().items(Joi.number()).optional(),
  })
);

export const DailyReportSchema = Joi.object({
  sign: Joi.string().required(),
  date: Joi.date().required(),
  start: Joi.string().required(),
  pause: Joi.string().required(),
  end: Joi.string().required(),
  remarks: Joi.string().allow(null).optional(),
  clientId: ForeignKeySchema.optional(),
  taskId: ForeignKeySchema.optional(),
});

export const PostEmailSchema = Joi.object({
  subject: Joi.string().allow(''),
  content: Joi.string().allow(''),
  serviceId: ForeignKeySchema.optional(),
  parentEmailId: ForeignKeySchema.optional(),
  receivers: Joi.array().items(ForeignKeySchema).default([]),
});

export const PutReviewSchema = Joi.object({
  title: Joi.string().optional().allow(''),
  content: Joi.string().optional().allow(''),
  rate: Joi.number().positive().min(1).max(5).required(),
});

export const PostAppointmentSchema = Joi.object({
  subject: Joi.string().required(),
  clientId: ForeignKeySchema,
  employeeId: ForeignKeySchema,
  date: Joi.date().required(),
  altDate: Joi.date().optional(),
  createMeeting: Joi.boolean().default(false),
}).xor('clientId', 'employeeId');

export const PostInvoiceSchema = Joi.object({
  clientId: ForeignKeySchema.required(),
  netAmount: Joi.number().required().description('Net amount of the invoice'),
  tax: Joi.number().default(0.19).description('Tax rate (VAT rate)'),
  vatAmount: Joi.number().description(
    'Calculated VAT amount based on netAmount and tax'
  ),
  totalAmount: Joi.number().description('Total amount including VAT'),
  paid: Joi.number()
    .default(0)
    .description('Amount already paid towards the invoice'),
  remainingInvoiceAmount: Joi.number().description(
    'Remaining amount to be paid (netAmount - paymentsMade)'
  ),
  paidVat: Joi.number().default(0).description('Amount of VAT already paid'),
  remainingVat: Joi.number().description(
    'Remaining VAT to be paid (vatAmount - paidVat)'
  ),
  remainingInvoiceGrossAmount: Joi.number().description(
    'Gross amount remaining to be paid (remainingInvoiceAmount + remainingVat)'
  ),
  calculationType: Joi.string().optional().allow('').allow(''),
  department: Joi.string().optional().allow('').allow(''),
  regulations: Joi.string().optional().allow('').allow(''),
  paymentDueDate: Joi.date().optional(),
  items: Joi.array().items(
    Joi.object({
      serviceId: ForeignKeySchema,
      period: Joi.string().allow(''),
      price: Joi.number(),
      amount: Joi.number().optional().default(1),
    })
  ),
});

export const TaskSchema = Joi.object({
  months: Joi.array().items(Joi.string()).optional().default([]),
  serviceId: ForeignKeySchema,
  isCompleted: Joi.boolean().optional().default(false),
  clientId: ForeignKeySchema,
  employees: Joi.array().items(ForeignKeySchema),
});
