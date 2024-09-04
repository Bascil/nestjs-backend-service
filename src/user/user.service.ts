import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    // Fetching users with their associated role
    const users = await prisma.user.findMany({
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        taxPin: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
      },
    });

    // Counting total users for pagination
    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / pageSize);

    // Structuring the response to include role name
    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      taxPin: user.taxPin,
      roleId: user.role.id,
      roleName: user.role.name,
      permissions: user.role.permissions,
    }));

    return {
      data: formattedUsers, // Moving users to data field
      meta: {
        from: skip + 1,
        to: skip + users.length,
        total: totalUsers,
        perPage: pageSize,
        lastPage: totalPages,
        currentPage: page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        taxPin: true,
        role: {
          select: {
            id: true,
            name: true, // Including role name
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      taxPin: user.taxPin,
      roleId: user.role.id,
      roleName: user.role.name, // Adding role name to the response
    };
  }

  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    taxPin: string;
    roleId: string;
    password: string; // Added password field
  }) {
    const newUser = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        taxPin: userData.taxPin,
        password: await hash(userData.password, 10),
        role: {
          connect: { id: userData.roleId },
        },
      },
    });

    return newUser;
  }

  async updateUser(
    userId: string,
    updateData: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      taxPin: string;
      roleId: string;
    }>,
  ) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        taxPin: updateData.taxPin,
        role: updateData.roleId
          ? {
              connect: { id: updateData.roleId },
            }
          : undefined,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'User deleted successfully' };
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async getUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: {
          select: {
            permissions: true,
          },
        },
      },
    });

    return {
      permissions: user.role.permissions, // Adding role name to the response
    };
  }
}

export default UserService;
