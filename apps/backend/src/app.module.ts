import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { TemplatesModule } from './templates/templates.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { SimulationsModule } from './simulations/simulations.module';
import { DetectionModule } from './detection/detection.module';
import { StatsModule } from './stats/stats.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './shared/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    EmployeesModule,
    TemplatesModule,
    CampaignsModule,
    SimulationsModule,
    DetectionModule,
    StatsModule,
    HealthModule,
  ],
})
export class AppModule {}

