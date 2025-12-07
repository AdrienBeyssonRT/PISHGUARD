import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CampaignStatus, Verdict } from '@prisma/client';

export interface OverviewStatsDto {
  organizationId: number;
  totalEmployees: number;
  totalCampaigns: number;
  runningCampaigns: number;
  lastCampaign: {
    id: number;
    name: string;
    startAt: string | null;
    endAt: string | null;
    openRate: number;
    clickRate: number;
    submitRate: number;
  } | null;
  detectionToday: {
    analyzed: number;
    safe: number;
    suspicious: number;
    phishing: number;
  };
  trendLast30Days: {
    date: string;
    analyzed: number;
    suspicious: number;
    phishing: number;
  }[];
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(organizationId: number): Promise<OverviewStatsDto> {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOf30DaysAgo = new Date(now);
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 29);
    startOf30DaysAgo.setHours(0, 0, 0, 0);

    const [totalEmployees, totalCampaigns, runningCampaigns, lastCampaign] =
      await Promise.all([
        this.prisma.employee.count({
          where: { organizationId },
        }),
        this.prisma.campaign.count({
          where: { organizationId },
        }),
        this.prisma.campaign.count({
          where: {
            organizationId,
            status: CampaignStatus.RUNNING,
          },
        }),
        this.prisma.campaign.findFirst({
          where: { organizationId },
          orderBy: { createdAt: 'desc' },
          include: { simulationEmails: true },
        }),
      ]);

    let lastCampaignStats: OverviewStatsDto['lastCampaign'] = null;
    if (lastCampaign) {
      const total = lastCampaign.simulationEmails.length || 1;
      const opened = lastCampaign.simulationEmails.filter((s) => s.openedAt).length;
      const clicked = lastCampaign.simulationEmails.filter((s) => s.clickedAt).length;
      const submitted = lastCampaign.simulationEmails.filter((s) => s.submittedAt).length;

      lastCampaignStats = {
        id: lastCampaign.id,
        name: lastCampaign.name,
        startAt: lastCampaign.startAt?.toISOString() ?? null,
        endAt: lastCampaign.endAt?.toISOString() ?? null,
        openRate: opened / total,
        clickRate: clicked / total,
        submitRate: submitted / total,
      };
    }

    const detectionTodayRaw = await this.prisma.detectionEvent.groupBy({
      by: ['verdict'],
      _count: true,
      where: {
        organizationId,
        createdAt: {
          gte: startOfToday,
        },
      },
    });

    const detectionToday = {
      analyzed: detectionTodayRaw.reduce((acc, cur) => acc + cur._count, 0),
      safe: detectionTodayRaw.find((d) => d.verdict === Verdict.SAFE)?._count || 0,
      suspicious:
        detectionTodayRaw.find((d) => d.verdict === Verdict.SUSPICIOUS)?._count || 0,
      phishing:
        detectionTodayRaw.find((d) => d.verdict === Verdict.PHISHING)?._count || 0,
    };

    const detectionLast30 = await this.prisma.detectionEvent.findMany({
      where: {
        organizationId,
        createdAt: {
          gte: startOf30DaysAgo,
          lte: now,
        },
      },
      select: {
        createdAt: true,
        verdict: true,
      },
    });

    const dailyMap = new Map<
      string,
      { analyzed: number; suspicious: number; phishing: number }
    >();

    for (let i = 0; i < 30; i++) {
      const d = new Date(startOf30DaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { analyzed: 0, suspicious: 0, phishing: 0 });
    }

    for (const evt of detectionLast30) {
      const key = evt.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(key);
      if (!entry) continue;
      entry.analyzed++;
      if (evt.verdict === Verdict.SUSPICIOUS) entry.suspicious++;
      if (evt.verdict === Verdict.PHISHING) entry.phishing++;
    }

    const trendLast30Days = Array.from(dailyMap.entries()).map(
      ([date, stats]) => ({
        date,
        ...stats,
      }),
    );

    return {
      organizationId,
      totalEmployees,
      totalCampaigns,
      runningCampaigns,
      lastCampaign: lastCampaignStats,
      detectionToday,
      trendLast30Days,
    };
  }
}


