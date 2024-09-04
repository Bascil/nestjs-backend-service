import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  // Create a new role with associated permissions
  async create(createRoleDto: CreateRoleDto) {
    const { name, permissions } = createRoleDto;

    // Check if the role already exists
    if (await this.findByName(name)) {
      throw new ConflictException('Role already exists');
    }

    // Create role with permissions relation
    const role = await this.prisma.role.create({
      data: {
        name,
        permissions,
      },
    });

    return role;
  }

  // Get paginated list of roles
  async findAll(page: number = 1, perPage: number = 10) {
    const skip = (page - 1) * perPage;
    const total = await this.prisma.role.count();

    const roles = await this.prisma.role.findMany({
      skip,
      take: perPage,
      orderBy: { name: 'asc' },
    });

    const result = roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.permissions, // Return permission names
    }));

    return {
      data: result,
      meta: {
        from: skip + 1,
        to: skip + roles.length,
        total,
        perPage,
        lastPage: Math.ceil(total / perPage),
        currentPage: page,
      },
    };
  }

  // Get a single role by ID
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.permissions,
    };
  }

  // Update a role by ID
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { name, permissions } = updateRoleDto;

    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if the role name is being updated to an already existing name
    if (name && name !== role.name && (await this.findByName(name))) {
      throw new ConflictException('Role name already exists');
    }

    // Fetch updated permissions from database
    const permissionsData = await this.getPermissionsByName(permissions);

    // Update role with new permissions
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        name,
        permissions,
      },
    });

    return {
      id: updatedRole.id,
      name: updatedRole.name,
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt,
      permissions: updatedRole.permissions,
    };
  }

  // Delete a role by ID
  async remove(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Delete role
    return await this.prisma.role.delete({
      where: { id },
    });
  }

  // Helper function to find a role by name
  async findByName(name: string) {
    return await this.prisma.role.findFirst({
      where: { name },
    });
  }

  // Helper function to fetch permissions by their names
  private async getPermissionsByName(permissionNames: string[]) {
    const permissions = await this.prisma.permission.findMany({
      where: {
        name: { in: permissionNames },
      },
    });

    if (permissions.length !== permissionNames.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    return permissions;
  }
}
