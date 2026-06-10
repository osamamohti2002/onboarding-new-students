import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiParam} from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({summary: 'List all audits (admin, operator HR, operator IT)'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT)
  @Get()
  findAll(@Query() pagination: PaginationDto){
    return this.auditService.findAll(pagination);
  }

  @ApiOperation({summary: 'Get audit by id (admin, operator HR, operator IT)'})
  @ApiParam({name: 'id', description: 'Id of the audit', type: 'string', example: '7cb3e49e-bdf2-47ad-be0a-bd3dd143debc'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT)
  @Get(':id')
  findById(@Param('id') id: string){
    return this.auditService.findById(id);
  }
}
