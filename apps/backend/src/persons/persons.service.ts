import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PersonsService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreatePersonDto){
    const existingPerson = await this.prisma.person.findUnique({
      where: {
        email: data.email
      }
    });

    if(existingPerson){
      throw new BadRequestException('user already exists');
    };

    const newPerson = await this.prisma.person.create({
      data:{
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      }
    });

    return newPerson;
    
  }

  
  async findOrCreate(data: CreatePersonDto){
    const person = await this.prisma.person.findUnique({
      where: {
        email: data.email
      }
    });

    if(person){
      return person;
    };

    const newPerson = await this.prisma.person.create({
      data:{
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      }
    });

    return newPerson;
  }


  async findById(id: string){
    const person = await this.prisma.person.findUnique({
      where: {
        id
      }
    });

    if(!person){
      throw new NotFoundException('Person Not Found');
    };
    
    return person;

  }

  async findByEmail(email: string){
    const person = await this.prisma.person.findUnique({
      where:{
        email: email
      }

    });

    if(!person){
      throw new NotFoundException('Invalid Email');
    }

    return person;
  }

  async update(id: string, data: UpdatePersonDto){
    const existingPerson = await this.prisma.person.findUnique({
      where: {
        id
      }
    });

    if(!existingPerson){
      throw new NotFoundException('Person Not Found');
    };

    const updatedPerson = await this.prisma.person.update({
      where: {
        id
      },
      data
    });

    return updatedPerson;
  }
  
}
