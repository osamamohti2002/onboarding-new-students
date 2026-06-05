import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR, UserRole.OPERATOR_IT)
  @Get(':id')
  findById(@Param('id') id: string){
    return this.personsService.findById(id);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR)
  @Get('email/:email')
  findByEmail(@Param('email') email: string){
    return this.personsService.findByEmail(email);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING)
  @Post()
  create(@Body() data: CreatePersonDto){
    return this.personsService.create(data);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR_ONBOARDING, UserRole.OPERATOR_HR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePersonDto){
    return this.personsService.update(id, data);
  }


}
