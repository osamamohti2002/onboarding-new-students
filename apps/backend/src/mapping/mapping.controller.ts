import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { CreateMappingDto } from './dto/create-mapping.dto';
import { UpdateMappingDto } from './dto/update-mapping.dto';

@Controller('mapping')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Post()
  create(@Body() createMappingDto: CreateMappingDto) {
    return this.mappingService.create(createMappingDto);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mappingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMappingDto: UpdateMappingDto) {
    return this.mappingService.update(+id, updateMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mappingService.remove(+id);
  }
}
