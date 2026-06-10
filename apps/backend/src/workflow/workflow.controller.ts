import { Body, Controller, Param, Patch } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @ApiOperation({summary: 'Validate VOG step'})
  @ApiParam({name: 'caseId', example: '5aab4b14-46f2-4b74-98ed-c80317c308b2', description: 'The UUID of the case'})
  @ApiResponse({status: 200, description: 'VOG step validated'})
  @ApiResponse({status: 400, description: 'Evidence URL is required'})
  @ApiResponse({status: 404, description: 'Case not found'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR)
  @Patch(':caseId/vog')
  async validateVog(
    @Param('caseId') caseId: string,
    @Body('evidenceUrl') evidenceUrl: string, 
    @CurrentUser() user: any
    ){
      return this.workflowService.validateVog(caseId, evidenceUrl, user.sub)
  }


  @ApiOperation({summary: 'Validate contract step'})
  @ApiParam({name: 'caseId', example: '5aab4b14-46f2-4b74-98ed-c80317c308b2', description: 'The UUID of the case'})
  @ApiResponse({status: 200, description: 'Contract signed successfully'})
  @ApiResponse({status: 400, description: 'Evidence URL is required'})
  @ApiResponse({status: 403, description: 'VOG must be validated first'})
  @ApiResponse({status: 404, description: 'Contract step not found'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR)
  @Patch(':caseId/contract')
  async signContract(
    @Param('caseId') caseId: string,
    @Body('evidenceUrl') evidenceUrl: string,
    @CurrentUser() user: any,
  ){
    return this.workflowService.signContract(caseId, evidenceUrl, user.sub);
  }
}
