import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StepType } from 'generated/prisma';

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
}
