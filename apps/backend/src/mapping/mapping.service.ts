import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMappingDto } from './dto/create-mapping.dto';
import { UpdateMappingDto } from './dto/update-mapping.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MappingService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateMappingDto) {
    const exists = await this.prisma.mappingRule.findUnique({
      where:{
        trajectType_team_project_googleGroup:{
          trajectType: data.trajectType,
          team: data.team ?? '',
          project: data.project ?? '',
          googleGroup: data.googleGroup,
        }
      }
    });

    if(exists){
      throw new BadRequestException("Mapping rule already exists");
    }

    return this.prisma.mappingRule.create({
      data:{
        trajectType: data.trajectType,
        team: data.team ?? null,
        project: data.project ?? null,
        googleGroup: data.googleGroup,
        slackChannel: data.slackChannel,
        slackUsergroup: data.slackUsergroup ?? null,
      }
    });
  }

  async findAll(pagination: PaginationDto) {
    const skip = (pagination.page - 1) * pagination.limit;
    const [rules, total] = await this.prisma.$transaction([
      this.prisma.mappingRule.findMany({
        skip,
        take: pagination.limit,
        orderBy: {createdAt: 'desc'}
      }),
      this.prisma.mappingRule.count(),
    ]);
    return{
      data: rules, total, page: pagination.page, limit: pagination.limit
    }
  }

  async findById(id: string) {
    const rule = await this.prisma.mappingRule.findUnique({
      where:{id}
    });
    if(!rule){throw new NotFoundException('Mapping rule not found');}
    return rule;
  }

  async findByTrajectType(trajectType: string, team?: string, project?: string){
    return this.prisma.mappingRule.findMany({
      where:{
        trajectType,
        team: team ?? null,
        project: project ?? null
      },
      orderBy:{team: 'asc'}
    });
  }

  
  async update(id: string, data: UpdateMappingDto) {
    const rule = await this.prisma.mappingRule.findUnique({
      where: {id}
    })
    if(!rule){throw new NotFoundException('Rule not found')}

    const updatedRule = await this.prisma.mappingRule.update({
      where:{id},
      data:{
        trajectType: data.trajectType ?? rule.trajectType,
        team: data.team ?? rule.team,
        project: data.project ?? rule.project,
        googleGroup: data.googleGroup ?? rule.googleGroup,
        slackChannel: data.slackChannel ?? rule.slackChannel,
        slackUsergroup: data.slackUsergroup ?? rule.slackUsergroup,
      }
    });

    return updatedRule;

  }

  async remove(id: string) {
    const isRuleExist = await this.prisma.mappingRule.findUnique({
      where:{id}
    })
    if(!isRuleExist){
      throw new NotFoundException('Rule not found')
    }
    await this.prisma.mappingRule.delete({
      where:{id}
    })
    return {message: 'Mapping rule deleted successfully'}
  }
}
