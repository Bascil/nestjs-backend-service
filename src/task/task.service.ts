import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskService {
  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    // Fetching tasks with their associated role
    const tasks = await prisma.task.findMany({
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        projectId: true,
        project: {
          select: {
            name: true, // Include the project name
          },
        },
      },
    });

    // Counting total tasks for pagination
    const totalTasks = await prisma.task.count();
    const totalPages = Math.ceil(totalTasks / pageSize);

    // Structuring the response to include role name
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      projectId: task.projectId,
      projectName: task.project.name,
    }));

    return {
      data: formattedTasks,
      meta: {
        from: skip + 1,
        to: skip + tasks.length,
        total: totalTasks,
        perPage: pageSize,
        lastPage: totalPages,
        currentPage: page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  }

  async getTaskById(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        projectId: true,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      projectId: task.projectId,
    };
  }

  async createTask(taskData: {
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    projectId: string;
    userId: string;
  }) {
    const newTask = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        dueDate: taskData.dueDate,
        projectId: taskData.projectId,
        userId: taskData.userId,
      },
    });

    return newTask;
  }

  async updateTask(
    taskId: string,
    updateData: Partial<{
      title: string;
      description: string;
      status: string;
      dueDate: Date;
      projectId: string;
    }>,
  ) {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: updateData.title,
        description: updateData.description,
        status: updateData.status,
        dueDate: updateData.dueDate,
        projectId: updateData.projectId,
      },
    });

    return updatedTask;
  }

  async deleteTask(taskId: string) {
    await prisma.task.delete({
      where: { id: taskId },
    });
    return { message: 'Task deleted successfully' };
  }
}

export default TaskService;
