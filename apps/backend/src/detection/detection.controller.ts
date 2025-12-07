import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { DetectionService } from './detection.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    id: number;
    organizationId: number;
    role: string;
  };
}

@Controller('detection')
@UseGuards(JwtAuthGuard)
export class DetectionController {
  constructor(private detectionService: DetectionService) {}

  @Get('stats')
  async getStats(
    @Req() req: AuthRequest,
    @Query('range') range?: 'today' | 'last_30_days',
  ) {
    return this.detectionService.getStats(req.user.organizationId, range);
  }

  @Get('events')
  async getEvents(
    @Req() req: AuthRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.detectionService.getEvents(
      req.user.organizationId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }
}


