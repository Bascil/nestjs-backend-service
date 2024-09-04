import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma.service';
import UserService from '../user/user.service';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [PrismaService, UserService, ProjectService],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('shouldbe defined', () => {
    expect(controller).toBeDefined();
  });
});
