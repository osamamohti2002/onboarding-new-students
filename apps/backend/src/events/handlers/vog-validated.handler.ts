import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PrismaService } from "src/prisma/prisma.service";
import { VogValidatedEvent } from "../events/vog-validated.event";
import { StepStatus, StepType } from "generated/prisma";

@Injectable()
export class VogValidatedHandler{
    constructor(private readonly prisma: PrismaService){}

    @OnEvent('vog.validated')
    async handle(event: VogValidatedEvent){
        await this.prisma.workflowStep.update({
            where:{
                caseId_stepType:{
                    caseId: event.caseId,
                    stepType: StepType.CONTRACT_SIGNED,
                }
            },
            data:{
                status: StepStatus.PENDING,
            }
        });
    }
    
}