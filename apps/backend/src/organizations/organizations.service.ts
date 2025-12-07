import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
        employees: true,
      },
    });
  }
}

