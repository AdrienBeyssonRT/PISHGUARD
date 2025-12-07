import { Controller, Get, Param, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { TrackingService } from './tracking.service';

@Controller('sim')
export class TrackingController {
  constructor(private trackingService: TrackingService) {}

  @Get('open/:token.png')
  async trackOpen(@Param('token') token: string, @Res() res: Response) {
    const data = this.trackingService.decodeToken(token);
    await this.trackingService.markAsOpened(data.simulationEmailId);

    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
      'base64',
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Content-Length', pixel.length.toString());
    return res.send(pixel);
  }

  @Get('click/:token')
  async trackClick(@Param('token') token: string, @Res() res: Response) {
    const data = this.trackingService.decodeToken(token);
    await this.trackingService.markAsClicked(data.simulationEmailId);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/training/login-simulation?token=${token}`);
  }

  @Post('submit')
  async trackSubmit(@Body() body: { token: string }, @Res() res: Response) {
    const data = this.trackingService.decodeToken(body.token);
    await this.trackingService.markAsSubmitted(data.simulationEmailId);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/training/awareness`);
  }
}


