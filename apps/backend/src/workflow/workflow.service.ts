import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StepStatus, StepType } from 'generated/prisma';
import { AuditService } from 'src/audit/audit.service';
import { throwError } from 'rxjs';

@Injectable()
export class WorkflowService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ){}

  async validateVog(caseId: string, evidenceUrl: string, actorId:string){

    if(!evidenceUrl){
      throw new BadRequestException('Evidence URL is required for VOG validation');
    }


    const vogStep = await this.prisma.workflowStep.findUnique({
      where:{
        caseId_stepType:{
          caseId,
          stepType: StepType.VOG_VALIDATED,
        }
      }
    });

    if(!vogStep){throw new NotFoundException('VOG step not found')};
    
    const updatedStep = await this.prisma.workflowStep.update({
      where:{
        id: vogStep.id
      },
      data:{
        status: StepStatus.COMPLETED,
        evidenceUrl,
        completedAt: new Date()
      }
    });

    try{
      await this.auditService.log({
        eventType: 'VOG_VALIDATED',
        actorId,
        caseId,
        result: 'SUCCESS',
        payload:{
          evidenceUrl,
          complatedAt: new Date(),
        }
      })
    }catch(error){
        console.log('Audit log creation failed: ', error);
    }

    return updatedStep;
    
  } 

  private async checkVogGate(caseId: string): Promise<void>{
    const vogStep = await this.prisma.workflowStep.findUnique({
      where:{
        caseId_stepType:{
          caseId,
          stepType: StepType.VOG_VALIDATED,
        }
      }
    });

    if(!vogStep || vogStep.status !== StepStatus.COMPLETED){
      throw new ForbiddenException('VOG must be validated before signing contract');
    };
  }

  async signContract(caseId: string, evidenceUrl: string, actorId: string){
    await this.checkVogGate(caseId);

    if(!evidenceUrl){
      throw new BadRequestException('Evidence URL is required for contract signing')
    };

    const contractStep = await this.prisma.workflowStep.findUnique({
      where:{
        caseId_stepType:{
          caseId,
          stepType: StepType.CONTRACT_SIGNED
        }
      }
    });

    if(!contractStep){
      throw new NotFoundException('Contract not found');
    };

    const updatedStep = await this.prisma.workflowStep.update({
      where:{id: contractStep.id},
      data:{
        status: StepStatus.COMPLETED,
        evidenceUrl,
        completedAt: new Date()
      }
    });

    try{
      await this.auditService.log({
        eventType: 'CONTRACT_SIGNED',
        actorId,
        caseId,
        result: 'SUCCESS',
        payload:{
          evidenceUrl,
          completedAt: new Date()
        }
      });
    }catch(error){
      console.log('Audit log failed for signContract: ', error)
    }
    
    return updatedStep;
  }


}
