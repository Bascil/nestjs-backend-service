import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './response.interceptor';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { AuthMiddleware } from './auth/auth.middleware';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolesGuard } from './role/guards/roles.guard';
import { RoleService } from './role/role.service';
import CustomerService from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';
import TaskService from './task/task.service';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import ProjectService from './project/project.service';
import LeadService from './lead/lead.service';
import { LeadModule } from './lead/lead.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    CustomerModule,
    ProjectModule,
    TaskModule,
    LeadModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtService,
    UserService,
    RoleService,
    CustomerService,
    ProjectService,
    TaskService,
    LeadService,
    PrismaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'login', version: '1', method: RequestMethod.ALL })
      .exclude({ path: 'register', version: '1', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL, version: '1' });
  }
}
