import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    id: number;
    organizationId: number;
    role: string;
  };
}

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('me')
  async getMyOrganization(@Req() req: AuthRequest) {
    return this.organizationsService.findOne(req.user.organizationId);
  }
}


