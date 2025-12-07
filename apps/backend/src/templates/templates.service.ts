import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: number, dto: CreateTemplateDto) {
    return this.prisma.template.create({
      data: {
        ...dto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: number) {
    const [orgTemplates, globalTemplates] = await Promise.all([
      this.prisma.template.findMany({
        where: { organizationId },
      }),
      this.prisma.template.findMany({
        where: { isGlobal: true },
      }),
    ]);

    return [...orgTemplates, ...globalTemplates];
  }

  async findOne(id: number, organizationId: number) {
    return this.prisma.template.findFirst({
      where: {
        id,
        OR: [
          { organizationId },
          { isGlobal: true },
        ],
      },
    });
  }
}


