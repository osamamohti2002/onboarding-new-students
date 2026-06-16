import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { StepType, UserRole } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Get()
  async findAll(@Query() pagination: PaginationDto){
    return this.casesService.findAll(pagination);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Patch(':caseId/steps/:stepId')
  async updateStep(@Param('caseId') caseId: string, @Param('stepId') stepId: string, @Body() data: UpdateStepDto){
    return this.casesService.updateStep(stepId, data, caseId);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Get(':caseId/steps/:stepType')
  async getStep(@Param('caseId') caseId: string, @Param('stepType', new ParseEnumPipe(StepType)) stepType: StepType){
    return this.casesService.getStep(caseId, stepType);
  }

}
