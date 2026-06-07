import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


export interface CreateAuditLogDto {
  eventType: string;
  actorId: string;
  caseId: string
  targetPersonId: string;
  externalId: string;
  result: string;
  payload?: Record<string, any>;
}

@Injectable()
export class AuditService {

  constructor(private readonly prisma: PrismaService){}


  async log(data: CreateAuditLogDto){
    try{
      return await this.prisma.auditLog.create({
        data: {
          eventType: data.eventType,
          actorId: data.actorId,
          caseId: data.caseId,
          targetPersonId: data.targetPersonId,
          externalId: data.externalId,
          result: data.result,
          correlationId: crypto.randomUUID(),
          payload: data.payload ?? undefined,
        },
      });
    } catch (error) {
      console.log('Audit log creation failed: ', error)
    }
    return null;
  }

  

}
