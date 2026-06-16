import { Body, Controller, Param, Patch } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR)
  @Patch(':caseId/vog')
  async validateVog(
    @Param('caseId') caseId: string,
    @Body('evidenceUrl') evidenceUrl: string, 
    @CurrentUser() user: any
    ){
      return this.workflowService.validateVog(caseId, evidenceUrl, user.id)
  }


  @Roles(UserRole.ADMIN, UserRole.OPERATOR_HR)
  @Patch(':caseId/contract')
  async signContract(
    @Param('caseId') caseId: string,
    @Body('evidenceUrl') evidenceUrl: string,
    @CurrentUser() user: any,
  ){
    return this.workflowService.signContract(caseId, evidenceUrl, user.id);
  }
}
