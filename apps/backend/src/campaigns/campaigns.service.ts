import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: number, dto: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({
      data: {
        name: dto.name,
        organizationId,
        templateId: dto.templateId,
        status: CampaignStatus.DRAFT,
        startAt: dto.startAt ? new Date(dto.startAt) : null,
      },
      include: {
        template: true,
      },
    });

    // Create simulation emails for each employee
    const employees = await this.prisma.employee.findMany({
      where: {
        organizationId,
        id: { in: dto.employeeIds },
      },
    });

    const simulationEmails = employees.map((employee) => ({
      campaignId: campaign.id,
      employeeId: employee.id,
    }));

    await this.prisma.simulationEmail.createMany({
      data: simulationEmails,
    });

    return campaign;
  }

  async findAll(organizationId: number) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        simulationEmails: true,
        template: true,
      },
    });

    return campaigns.map((c) => {
      const total = c.simulationEmails.length || 1;
      const opened = c.simulationEmails.filter((s) => s.openedAt).length;
      const clicked = c.simulationEmails.filter((s) => s.clickedAt).length;
      const submitted = c.simulationEmails.filter((s) => s.submittedAt).length;

      return {
        id: c.id,
        name: c.name,
        status: c.status,
        startAt: c.startAt?.toISOString() ?? null,
        endAt: c.endAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
        totalTargets: c.simulationEmails.length,
        openRate: opened / total,
        clickRate: clicked / total,
        submitRate: submitted / total,
      };
    });
  }

  async findOne(organizationId: number, id: number) {
    const campaign = await this.prisma.campaign.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        template: true,
        simulationEmails: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const total = campaign.simulationEmails.length || 1;
    const opened = campaign.simulationEmails.filter((s) => s.openedAt).length;
    const clicked = campaign.simulationEmails.filter((s) => s.clickedAt).length;
    const submitted = campaign.simulationEmails.filter((s) => s.submittedAt).length;
    const sent = campaign.simulationEmails.filter((s) => s.sentAt).length;

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      startAt: campaign.startAt?.toISOString() ?? null,
      endAt: campaign.endAt?.toISOString() ?? null,
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      templateName: campaign.template.name,
      stats: {
        totalTargets: campaign.simulationEmails.length,
        sent,
        opened,
        clicked,
        submitted,
        openRate: opened / total,
        clickRate: clicked / total,
        submitRate: submitted / total,
      },
    };
  }

  async listCampaignEmails(
    organizationId: number,
    campaignId: number,
    skip: number = 0,
    take: number = 50,
  ) {
    const campaign = await this.prisma.campaign.findFirst({
      where: {
        id: campaignId,
        organizationId,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const [emails, total] = await Promise.all([
      this.prisma.simulationEmail.findMany({
        where: { campaignId },
        skip,
        take,
        include: {
          employee: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.simulationEmail.count({
        where: { campaignId },
      }),
    ]);

    return {
      items: emails.map((e) => ({
        id: e.id,
        employeeId: e.employeeId,
        employeeEmail: e.employee.email,
        employeeFirstName: e.employee.firstName,
        employeeLastName: e.employee.lastName,
        team: e.employee.team,
        sentAt: e.sentAt?.toISOString() ?? null,
        openedAt: e.openedAt?.toISOString() ?? null,
        clickedAt: e.clickedAt?.toISOString() ?? null,
        submittedAt: e.submittedAt?.toISOString() ?? null,
      })),
      total,
      skip,
      take,
    };
  }
}

