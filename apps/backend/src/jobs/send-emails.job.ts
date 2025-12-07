import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../shared/prisma.service';
import { TrackingService } from '../simulations/tracking.service';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class SendEmailsJob {
  private readonly logger = new Logger(SendEmailsJob.name);

  constructor(
    private prisma: PrismaService,
    private trackingService: TrackingService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Vérification des emails à envoyer...');

    const now = new Date();

    // Récupérer les campagnes actives avec des emails non envoyés
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        status: CampaignStatus.RUNNING,
        OR: [
          { startAt: null },
          { startAt: { lte: now } },
        ],
      },
      include: {
        template: true,
        simulationEmails: {
          where: {
            sentAt: null,
          },
          include: {
            employee: true,
          },
          take: 10, // Limiter pour éviter la surcharge
        },
      },
    });

    for (const campaign of campaigns) {
      for (const simulationEmail of campaign.simulationEmails) {
        try {
          await this.sendSimulationEmail(
            campaign,
            simulationEmail,
          );
        } catch (error) {
          this.logger.error(
            `Erreur envoi email ${simulationEmail.id}: ${error.message}`,
          );
        }
      }
    }
  }

  private async sendSimulationEmail(campaign: any, simulationEmail: any) {
    const employee = simulationEmail.employee;
    const template = campaign.template;

    // Générer le token de tracking
    const token = this.trackingService.encodeToken({
      simulationEmailId: simulationEmail.id,
      organizationId: campaign.organizationId,
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const trackingLink = `${baseUrl}/sim/click/${token}`;
    const openPixelUrl = `${baseUrl}/sim/open/${token}.png`;

    // Remplacer les placeholders dans le template
    let htmlBody = template.htmlBody
      .replace(/\{\{first_name\}\}/g, employee.firstName || '')
      .replace(/\{\{last_name\}\}/g, employee.lastName || '')
      .replace(/\{\{company_name\}\}/g, 'Votre entreprise')
      .replace(/\{\{tracking_link\}\}/g, trackingLink)
      .replace(/\{\{open_pixel_url\}\}/g, openPixelUrl);

    let subject = template.subject
      .replace(/\{\{first_name\}\}/g, employee.firstName || '')
      .replace(/\{\{company_name\}\}/g, 'Votre entreprise');

    // Envoyer l'email (stub - à implémenter avec SendGrid/SES)
    this.logger.log(
      `Envoi email simulation ${simulationEmail.id} à ${employee.email}`,
    );

    // TODO: Implémenter l'envoi réel avec SendGrid/SES
    // Pour l'instant, on marque juste comme envoyé
    await this.prisma.simulationEmail.update({
      where: { id: simulationEmail.id },
      data: { sentAt: new Date() },
    });

    this.logger.log(`Email ${simulationEmail.id} marqué comme envoyé`);
  }
}


