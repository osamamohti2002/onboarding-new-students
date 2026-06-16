import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('persons')
@ApiBearerAuth('JWT')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}


  @ApiOperation({summary: 'Get a person by ID'})
  @ApiParam({name: 'id', example: '888d8988-34c2-4ec5-8970-4a4abf3ff138', description: 'The UUID of the person'})
  @ApiResponse({status: 200, description: 'Person found'})
  @ApiResponse({status: 404, description: 'Person not found'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT)
  @Get(':id')
  findById(@Param('id') id: string){
    return this.personsService.findById(id);
  }

  @ApiOperation({summary: 'Get a person by email'})
  @ApiParam({name: 'email', example: 'test@gmail.com', description: 'The email of the person'})
  @ApiResponse({status: 200, description: 'Person found'})
  @ApiResponse({status: 404, description: 'Person not found'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR)
  @Get('email/:email')
  findByEmail(@Param('email') email: string){
    return this.personsService.findByEmail(email);
  }

  @ApiExcludeEndpoint()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING)
  @Post()
  create(@Body() data: CreatePersonDto){
    return this.personsService.create(data);
  }

  @ApiOperation({summary: 'Update a person by ID'})
  @ApiParam({name: 'id', example: '888d8988-34c2-4ec5-8970-4a4abf3ff138', description: 'The UUID of the person'})
  @ApiResponse({status: 200, description: 'Person updated'})
  @ApiResponse({status: 404, description: 'Person not found'})
  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePersonDto){
    return this.personsService.update(id, data);
  }


}
