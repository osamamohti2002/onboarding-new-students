import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePersonDto {

    @ApiProperty({description: 'first name of the person', example: 'John'})
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({description: 'last name of the person', example: 'Doe'})
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({description: 'email of the person', example: 'johndoe@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({description: 'phone number of the person', example: '1234567890'})
    @IsString()
    @IsOptional()
    phone?: string;
  
}
