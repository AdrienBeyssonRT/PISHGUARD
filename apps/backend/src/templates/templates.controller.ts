import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    id: number;
    organizationId: number;
    role: string;
  };
}

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    return this.templatesService.findAll(req.user.organizationId);
  }

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateTemplateDto) {
    return this.templatesService.create(req.user.organizationId, dto);
  }

  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.templatesService.findOne(
      parseInt(id),
      req.user.organizationId,
    );
  }
}

