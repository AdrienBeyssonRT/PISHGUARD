import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { Verdict } from '@prisma/client';

@Injectable()
export class DetectionService {
  constructor(private prisma: PrismaService) {}

  async getStats(organizationId: number, range: 'today' | 'last_30_days' = 'today') {
    const now = new Date();
    let startDate: Date;

    if (range === 'today') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }

    const events = await this.prisma.detectionEvent.findMany({
      where: {
        organizationId,
        createdAt: {
          gte: startDate,
        },
      },
    });

    const analyzed = events.length;
    const safe = events.filter((e) => e.verdict === Verdict.SAFE).length;
    const suspicious = events.filter((e) => e.verdict === Verdict.SUSPICIOUS).length;
    const phishing = events.filter((e) => e.verdict === Verdict.PHISHING).length;

    return {
      analyzed,
      safe,
      suspicious,
      phishing,
    };
  }

  async getEvents(
    organizationId: number,
    limit: number = 50,
    offset: number = 0,
  ) {
    const [events, total] = await Promise.all([
      this.prisma.detectionEvent.findMany({
        where: { organizationId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.detectionEvent.count({
        where: { organizationId },
      }),
    ]);

    return {
      items: events,
      total,
      limit,
      offset,
    };
  }
}


