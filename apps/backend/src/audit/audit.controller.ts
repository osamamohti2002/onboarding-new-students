import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT)
  @Get()
  findAll(@Query() pagination: PaginationDto){
    return this.auditService.findAll(pagination);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT)
  @Get(':id')
  findById(@Param('id') id: string){
    return this.auditService.findById(id);
  }
}
