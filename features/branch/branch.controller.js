import prisma from '../../prisma/client.js';

export const getBranches = async (req, res, next) => {
  const branches = await prisma.branch.findMany({
    include: {
      supervisor: true,
      teams: true,
      Client: true,
    },
  });

  res.status(200).json(branches);
};

export const postBranch = async (req, res, next) => {
  const { name, supervisorId } = req.body;

  const createdBranch = await prisma.branch.create({
    data: {
      name,
      supervisorId,
    },
  });

  res.status(201).json(createdBranch);
};

export const patchBranch = async (req, res, next) => {
  const { branchId } = req.params;
  const { name, supervisorId } = req.body;

  const updatedBranch = await prisma.branch.update({
    where: { id: parseInt(branchId) },
    data: {
      name,
      supervisorId,
    },
  });

  res.status(200).json(updatedBranch);
};

export const deleteBranch = async (req, res, next) => {
  const { branchId } = req.params;

  await prisma.branch.delete({
    where: { id: parseInt(branchId) },
  });

  res.status(204).send();
};

export const addEmployeesToBranch = async (req, res, next) => {
  const { branchId } = req.params;
  const { employeeIds } = req.body;

  // const updatedBranch = await prisma.branch.update({
  //   where: { id: parseInt(branchId) },
  //   data: {
  //     employees: {
  //       connect: employeeIds.map((id) => ({ id: parseInt(id) })),
  //     },
  //   },
  // });

  // res.status(200).json(updatedBranch);
};

export const deleteEmployeesFromBranch = async (req, res, next) => {
  const { branchId } = req.params;
  const { employeeIds } = req.body;

  // const updatedBranch = await prisma.branch.update({
  //   where: { id: parseInt(branchId) },
  //   data: {
  //     employees: {
  //       disconnect: employeeIds.map((id) => ({ id: parseInt(id) })),
  //     },
  //   },
  // });

  // res.status(200).json(updatedBranch);
};
