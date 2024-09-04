import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectService {
  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    // Fetching projects with their associated role
    const projects = await prisma.project.findMany({
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    // Counting total projects for pagination
    const totalProjects = await prisma.project.count();
    const totalPages = Math.ceil(totalProjects / pageSize);

    // Structuring the response to include role name
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    }));

    return {
      data: formattedProjects,
      meta: {
        from: skip + 1,
        to: skip + projects.length,
        total: totalProjects,
        perPage: pageSize,
        lastPage: totalPages,
        currentPage: page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  }

  async getProjectById(endDate: string) {
    const project = await prisma.project.findUnique({
      where: { id: endDate },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    };
  }

  async createProject(projectData: {
    name: string;
    description: string;
    status: string;
    startDate: Date;
    endDate: Date;
  }) {
    const newProject = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
      },
    });

    return newProject;
  }

  async updateProject(
    endDate: string,
    updateData: Partial<{
      name: string;
      description: string;
      status: string;
      startDate: Date;
      endDate: Date;
    }>,
  ) {
    const updatedProject = await prisma.project.update({
      where: { id: endDate },
      data: {
        name: updateData.name,
        description: updateData.description,
        status: updateData.status,
        startDate: updateData.startDate,
        endDate: updateData.endDate,
      },
    });

    return updatedProject;
  }

  async deleteProject(endDate: string) {
    await prisma.project.delete({
      where: { id: endDate },
    });
    return { message: 'Project deleted successfully' };
  }
}

export default ProjectService;
