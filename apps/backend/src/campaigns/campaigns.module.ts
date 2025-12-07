import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { EmployeesModule } from '../employees/employees.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [EmployeesModule, TemplatesModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}

