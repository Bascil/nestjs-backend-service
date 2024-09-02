import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
const prisma = new PrismaClient();
import { hash } from 'bcryptjs';

async function main() {
  const admin = await prisma.role.create({
    data: {
      name: 'Admin',
    },
  });

  const manager = await prisma.role.create({
    data: {
      name: 'Manager',
    },
  });
  const engineer = await prisma.role.create({
    data: {
      name: 'Engineer',
    },
  });

  // for (let i = 0; i < 100; i++) {
  //   await prisma.user.create({
  //     data: {
  //       name: faker.name.findName(),
  //       email: faker.internet.email(),
  //       password: await hash('admin', 10),
  //     },
  //   });
  // }

  const userAdmin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@bingwa.com',
      password: await hash('admin', 10),
      taxPin: 'ABCD1234',
    },
  });
  await prisma.user_role.create({
    data: {
      userId: userAdmin.id,
      roleId: admin.id,
    },
  });

  // project manager
  const userManager = await prisma.user.create({
    data: {
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@bingwa.com',
      password: await hash('manager', 10),
      taxPin: 'ABCD1235',
    },
  });

  await prisma.user_role.create({
    data: {
      userId: userManager.id,
      roleId: manager.id,
    },
  });

  const userEngineer = await prisma.user.create({
    data: {
      firstName: 'Engineer',
      lastName: 'User',
      email: 'engineer@bingwa.com',
      password: await hash('engineer', 10),
      taxPin: 'ABCD1236',
    },
  });

  await prisma.user_role.create({
    data: {
      userId: userEngineer.id,
      roleId: engineer.id,
    },
  });

  await prisma.permission.createMany({
    data: [
      { name: 'manage_system' },
      { name: 'manage_projects' },
      { name: 'manage_tasks' },
    ],
  });

  await assignPermissions(admin.id, [
    'manage_system',
    'manage_projects',
    'manage_tasks',
  ]);
  await assignPermissions(manager.id, ['manage_projects']);
  await assignPermissions(engineer.id, ['manage_tasks']);
}

async function assignPermissions(roleId: string, permissionNames: string[]) {
  const permissions = await prisma.permission.findMany({
    where: { name: { in: permissionNames } },
  });

  for (const permission of permissions) {
    await prisma.role_permission.create({
      data: {
        roleId,
        permissionId: permission.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
