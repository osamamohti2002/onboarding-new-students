import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR)
  @Post()
  async createCase(@Body() data: CreateCaseDto){
    return this.casesService.createCase(data)
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Get(':id')
  async findById(@Param('id') id: string){
    return this.casesService.findById(id);
  }
}
