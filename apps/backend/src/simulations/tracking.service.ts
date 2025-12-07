import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../shared/prisma.service';

const ALGO = 'aes-256-gcm';

@Injectable()
export class TrackingService {
  private encryptionKey: Buffer;

  constructor(private prisma: PrismaService) {
    const key = process.env.TRACKING_ENC_KEY;
    if (!key) {
      throw new Error('TRACKING_ENC_KEY environment variable is required');
    }
    this.encryptionKey = Buffer.from(key, 'hex');
  }

  encodeToken(payload: { simulationEmailId: number; organizationId: number }): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, this.encryptionKey, iv);
    const json = JSON.stringify(payload);
    const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString('base64url');
  }

  decodeToken(token: string): { simulationEmailId: number; organizationId: number } {
    try {
      const raw = Buffer.from(token, 'base64url');
      const iv = raw.subarray(0, 12);
      const authTag = raw.subarray(12, 28);
      const encrypted = raw.subarray(28);

      const decipher = crypto.createDecipheriv(ALGO, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
      return JSON.parse(decrypted);
    } catch (e) {
      throw new BadRequestException('Invalid tracking token');
    }
  }

  async markAsOpened(simulationEmailId: number) {
    await this.prisma.simulationEmail.update({
      where: { id: simulationEmailId },
      data: {
        openedAt: new Date(),
      },
    });
  }

  async markAsClicked(simulationEmailId: number) {
    await this.prisma.simulationEmail.update({
      where: { id: simulationEmailId },
      data: {
        clickedAt: new Date(),
      },
    });
  }

  async markAsSubmitted(simulationEmailId: number) {
    await this.prisma.simulationEmail.update({
      where: { id: simulationEmailId },
      data: {
        submittedAt: new Date(),
      },
    });
  }
}


