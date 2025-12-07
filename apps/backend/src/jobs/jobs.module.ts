import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SendEmailsJob } from './send-emails.job';
import { SimulationsModule } from '../simulations/simulations.module';
import { PrismaModule } from '../shared/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SimulationsModule,
    PrismaModule,
  ],
  providers: [SendEmailsJob],
})
export class JobsModule {}

