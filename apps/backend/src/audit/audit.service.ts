import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';


export interface CreateAuditLogDto {
  eventType: string;
  actorId?: string;
  caseId?: string
  targetPersonId?: string;
  externalId?: string;
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

  async findAll(pagination: PaginationDto){
    const skip = (pagination.page - 1) * pagination.limit;
    
    const [logs, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc'},
        include: {actor: true, case: true}
      }),
      this.prisma.auditLog.count(),
    ]);

    return{
      data: logs,
      total,
      page: pagination.page,
      limit: pagination.limit
    }


  }

  async findById(id: string){
    const auditLog = await this.prisma.auditLog.findUnique({
      where: {id},
      include: {actor: true, case: true}
    });
    if(!auditLog) return null;
    
    return auditLog
  }

}
