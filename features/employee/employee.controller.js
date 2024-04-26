import { hashPassword } from '../../libs/bcrypt.js';
import prisma from '../../prisma/client.js';

export const getEmployees = async (req, res, next) => {
  const { name, branchId, departmentId, teamId, email, status } = req.query;
};

export const postEmployee = async (req, res, next) => {};

export const patchEmployee = async (req, res, next) => {
  const { id } = req.params;

  const { name, email, password, ...updatedEmployee } = req.body;

  const data = {};

  if (password) {
    await hashPassword(password);
  }

  if (req.file) {
    data.user.profileImage = req.file.path;
  }

  if (name) data.user.name = name;
  if (email) data.user.email = email;

  const employee = await prisma.employee.update({
    where: { id: parseInt(id) },
    data: {
      ...updatedEmployee,
      ...data,
    },
  });

  res.statu(200).json(employee);
};

export const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;

  await prisma.employee.findUniqueOrThrow({
    where: { id: parseInt(id) },
  });

  await prisma.employee.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({ message: 'Employee deleted successfully' });
};
