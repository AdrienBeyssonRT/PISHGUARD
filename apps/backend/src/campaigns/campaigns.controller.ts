import { Controller, Get, Post, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    id: number;
    organizationId: number;
    role: string;
  };
}

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    return this.campaignsService.findAll(req.user.organizationId);
  }

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(req.user.organizationId, dto);
  }

  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.campaignsService.findOne(req.user.organizationId, parseInt(id));
  }

  @Get(':id/emails')
  async listEmails(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.campaignsService.listCampaignEmails(
      req.user.organizationId,
      parseInt(id),
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Post(':id/launch')
  async launch(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.campaignsService.launch(req.user.organizationId, parseInt(id));
  }
}

