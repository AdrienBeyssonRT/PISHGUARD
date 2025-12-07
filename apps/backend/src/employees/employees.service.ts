import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: number, dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        ...dto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: number) {
    return this.prisma.employee.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    return this.prisma.employee.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }
}

