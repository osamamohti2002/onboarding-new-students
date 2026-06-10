import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { StepType, UserRole } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @ApiOperation({ summary: 'Create a new case' })
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR)
  @Post()
  async createCase(@Body() data: CreateCaseDto){
    return this.casesService.createCase(data)
  }

  @ApiOperation({ summary: 'Get case by id' })
  @ApiParam({ name: 'id', example: '1df31901-203f-4ee7-9b66-4cc9aea19817' })
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Get(':id')
  async findById(@Param('id') id: string){
    return this.casesService.findById(id);
  }

  @ApiOperation({summary: 'Get all cases'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Get()
  async findAll(@Query() pagination: PaginationDto){
    return this.casesService.findAll(pagination);
  }

  @ApiOperation({summary: 'Update a step'})
  @ApiParam({name: 'stepId', example: '125b6854-d190-4e4e-9379-b5255305c610'})
  @ApiBody({type: UpdateStepDto})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Patch(':stepId')
  async updateStep(@CurrentUser() user: any,@Param('stepId') stepId: string, @Body() data: UpdateStepDto){
    return this.casesService.updateStep(stepId, data, user.sub);
  }

  @ApiOperation({summary: 'Get a step'})
  @ApiParam({name: 'caseId', example: '26052853-dcbb-40ad-8a8b-aaa64f0183d1'})
  @ApiParam({name: 'stepType', example: 'VOG_VALIDATED'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT, UserRole.TEAMLEAD)
  @Get(':caseId/steps/:stepType')
  async getStep(@Param('caseId') caseId: string, @Param('stepType') stepType: StepType){
    return this.casesService.getStep(caseId, stepType);
  }

}
