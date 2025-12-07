import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    id: number;
    organizationId: number;
    role: string;
  };
}

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    return this.employeesService.findAll(req.user.organizationId);
  }

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(req.user.organizationId, dto);
  }

  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.employeesService.findOne(
      parseInt(id),
      req.user.organizationId,
    );
  }
}

