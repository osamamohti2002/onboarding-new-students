import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { CreateMappingDto } from './dto/create-mapping.dto';
import { UpdateMappingDto } from './dto/update-mapping.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('mapping-rules')
@ApiBearerAuth('JWT')
@Controller('mapping-rules')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new mapping rule' })
  @ApiBody({
    schema: {
      example: {
        trajectType: 'Software Developer',
        team: 'Blue Team',
        project: 'Project X',
        googleGroup: 'students-2026@divd.academy',
        slackChannel: 'onboarding-2026',
        slackUsergroup: 'students',
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Mapping rule created' })
  @ApiResponse({ status: 400, description: 'Mapping rule already exists' })
  @Post()
  create(@Body() data: CreateMappingDto) {
    return this.mappingService.create(data);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all mapping rules' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Mapping rules retrieved' })
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.mappingService.findAll(pagination);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a mapping rule by ID' })
  @ApiParam({ name: 'id', example: '77159c65-c68c-4466-b17d-f9167dc0fb8f' })
  @ApiResponse({ status: 200, description: 'Mapping rule found' })
  @ApiResponse({ status: 404, description: 'Mapping rule not found' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mappingService.findById(id);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a mapping rule' })
  @ApiBody({
    schema: {
      example: {
        slackChannel: 'onboarding-2027',
      }
    }
  })
  @ApiParam({ name: 'id', example: '77159c65-c68c-4466-b17d-f9167dc0fb8f' })
  @ApiResponse({ status: 200, description: 'Mapping rule updated' })
  @ApiResponse({ status: 404, description: 'Mapping rule not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateMappingDto) {
    return this.mappingService.update(id, data);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a mapping rule' })
  @ApiParam({ name: 'id', example: '77159c65-c68c-4466-b17d-f9167dc0fb8f' })
  @ApiResponse({ status: 200, description: 'Mapping rule deleted' })
  @ApiResponse({ status: 404, description: 'Mapping rule not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mappingService.remove(id);
  }
}