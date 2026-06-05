import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StepType } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateStepDto } from './dto/update-step.dto';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService){}

  async createCase(data: CreateCaseDto){
    const person = await this.prisma.person.findUnique({
      where:{
        id: data.personId,
      },
    });
    if(!person){
      throw new NotFoundException('Persom not Found')
    }

  const result = await this.prisma.$transaction(async (tx) => {
    // onboardingcase aanmaken
    const onboardingCase = await tx.onboardingCase.create({
      data:{
        personId: data.personId,
        trajectType: data.trajectType,
        team: data.team,
        project: data.project,
        startDate: data.startDate ? new Date(data.startDate) : null,
        submittedById: data.submittedById,
      },
    });

    const stepTypes = Object.values(StepType);

    await tx.workflowStep.createMany({
      data: stepTypes.map((stepType) => ({
        caseId: onboardingCase.id,
        stepType: stepType,
      })),
    });

    return tx.onboardingCase.findUnique({
      where:{
        id: onboardingCase.id,
      },
      include:{
        steps: true,
        person: true,
      }
    });
  });
    return result;
  }

  async findById(id: string){
    const existingCase = await this.prisma.onboardingCase.findUnique({
      where:{
        id: id,
      },
      include:{
        person: true,
        steps: true,
      },
    });
    if(!existingCase){
      throw new NotFoundException('Case not found');
    }
    return existingCase;
  }

  async findAll(pagination: PaginationDto){
    const skip = (pagination.page - 1) * pagination.limit
    
    const [cases, total] = await this.prisma.$transaction([
      this.prisma.onboardingCase.findMany({
        skip: skip,
        take: pagination.limit,
        include:{
          person: true,
          steps: true,
        },
      }),
      this.prisma.onboardingCase.count(),
    ]);

    return {
      data: cases,
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async updateStep(stepId: string, data: UpdateStepDto){
    const existingStep = await this.prisma.workflowStep.findUnique({
      where: { id: stepId },
    });

    if(!existingStep){
      throw new NotFoundException('Step not found');
    }

    return this.prisma.workflowStep.update({
      where: { id: stepId },
      data:{
        status: data.status,
        evidenceUrl: data.evidenceUrl,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        ownerId: data.ownerId,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      }
    });
  }

  async getStep(caseId: string, stepType: StepType){
    const existingStep = await this.prisma.workflowStep.findUnique({
      where:{
        caseId_stepType:{
          caseId: caseId,
          stepType: stepType,
        },
      },
      include:{
        case: true,
      },
    });

    if(!existingStep){
      throw new NotFoundException('Step not found');
    };
  
    return existingStep;
  }

  
}
