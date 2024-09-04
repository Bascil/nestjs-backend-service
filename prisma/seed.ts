import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const permissions = await prisma.permission.createMany({
    data: [
      { name: 'manage_system' },
      { name: 'manage_projects' },
      { name: 'manage_leads' },
      { name: 'manage_tasks' },
    ],
  });

  // Create roles with permissions
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      permissions: [
        'manage_system',
        'manage_projects',
        'manage_leads',
        'manage_tasks',
      ],
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: 'Manager',
      permissions: ['manage_projects', 'manage_leads', 'manage_tasks'],
    },
  });

  const engineerRole = await prisma.role.create({
    data: {
      name: 'Engineer',
      permissions: ['manage_tasks'],
    },
  });

  // Create users with roles
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@bingwa.com',
      phoneNumber: '+254700123456',
      password: await hash('admin', 10),
      taxPin: 'ABCD1234',
      roleId: adminRole.id,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@bingwa.com',
      phoneNumber: '+254700123457',
      password: await hash('manager', 10),
      taxPin: 'ABCD1235',
      roleId: managerRole.id,
    },
  });

  const engineerUser = await prisma.user.create({
    data: {
      firstName: 'Engineer',
      lastName: 'User',
      email: 'engineer@bingwa.com',
      phoneNumber: '+254700123458',
      password: await hash('engineer', 10),
      taxPin: 'ABCD1236',
      roleId: engineerRole.id,
    },
  });

  // Create realistic projects
  const projects = [
    {
      name: 'E-commerce Platform Redesign',
      description:
        'Redesign and modernize our e-commerce platform to improve user experience and increase conversions.',
      status: 'in_progress',
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-06-30'),
    },
    {
      name: 'Mobile App Development',
      description:
        'Develop a new mobile app for both iOS and Android platforms to extend our service offerings.',
      status: 'planning',
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-09-30'),
    },
    {
      name: 'Data Analytics Dashboard',
      description:
        'Create a comprehensive data analytics dashboard for internal use to track KPIs and make data-driven decisions.',
      status: 'in_progress',
      startDate: new Date('2023-02-01'),
      endDate: new Date('2023-05-31'),
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // Create realistic tasks
  const tasks = [
    {
      title: 'Design new user interface',
      description:
        'Create wireframes and mockups for the new e-commerce platform design.',
      status: 'in_progress',
      dueDate: new Date('2023-03-15'),
      userId: engineerUser.id,
      projectId: (await prisma.project.findFirst({
        where: { name: 'E-commerce Platform Redesign' },
      }))!.id,
    },
    {
      title: 'Implement payment gateway',
      description:
        'Integrate a new payment gateway to support multiple currencies and payment methods.',
      status: 'pending',
      dueDate: new Date('2023-04-30'),
      userId: engineerUser.id,
      projectId: (await prisma.project.findFirst({
        where: { name: 'E-commerce Platform Redesign' },
      }))!.id,
    },
    {
      title: 'Develop iOS app prototype',
      description:
        'Create a working prototype of the iOS app with basic functionality.',
      status: 'pending',
      dueDate: new Date('2023-05-15'),
      userId: engineerUser.id,
      projectId: (await prisma.project.findFirst({
        where: { name: 'Mobile App Development' },
      }))!.id,
    },
    {
      title: 'Set up data pipeline',
      description:
        'Establish a data pipeline to collect and process data for the analytics dashboard.',
      status: 'in_progress',
      dueDate: new Date('2023-03-31'),
      userId: engineerUser.id,
      projectId: (await prisma.project.findFirst({
        where: { name: 'Data Analytics Dashboard' },
      }))!.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  // Create realistic leads
  const leads = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+254711223344',
      address: '123 Main St, Nairobi',
      source: 'Website Contact Form',
      status: 'new',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+254722334455',
      address: '456 Oak Ave, Mombasa',
      source: 'LinkedIn',
      status: 'contacted',
    },
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phoneNumber: '+254733445566',
      address: '789 Pine Rd, Kisumu',
      source: 'Referral',
      status: 'qualified',
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
  }

  const customers = [
    {
      firstName: 'Alice',
      lastName: 'Wanjiru',
      email: 'alice.wanjiru@example.com',
      phoneNumber: '+254712345678',
      address: '789 Kimathi St, Nairobi',
      isActive: true,
    },
    {
      firstName: 'Bob',
      lastName: 'Ochieng',
      email: 'bob.ochieng@example.com',
      phoneNumber: '+254723456789',
      address: '456 Moi Ave, Mombasa',
      isActive: true,
    },
    {
      firstName: 'Catherine',
      lastName: 'Njeri',
      email: 'catherine.njeri@example.com',
      phoneNumber: '+254734567890',
      address: '123 Oginga Odinga Rd, Kisumu',
      isActive: true,
    },
    {
      firstName: 'David',
      lastName: 'Mutua',
      email: 'david.mutua@example.com',
      phoneNumber: '+254745678901',
      address: '321 Kenyatta Ave, Nakuru',
      isActive: false,
    },
    {
      firstName: 'Eva',
      lastName: 'Akinyi',
      email: 'eva.akinyi@example.com',
      phoneNumber: '+254756789012',
      address: '654 Uhuru Highway, Eldoret',
      isActive: true,
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({ data: customer });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
