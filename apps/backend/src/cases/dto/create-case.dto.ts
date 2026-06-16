import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCaseDto {
    
    @ApiProperty({description: 'The id of the person.', example: '77159c65-c68c-4466-b17d-f9167dc0fb8f'})
    @IsString()
    @IsNotEmpty()
    personId: string;

    @ApiProperty({description: 'The type of traject.', example: 'Software Developer'})
    @IsString()
    @IsNotEmpty()
    trajectType: string;

    @ApiPropertyOptional({description: 'the name of the team', example: 'Super Heroes Developer'})
    @IsString()
    @IsOptional()
    team?: string;

    @ApiPropertyOptional({description: 'The name of the project.', example: 'Project X'})
    @IsString()
    @IsOptional()
    project?: string;

    @ApiPropertyOptional({description: 'The start date of the case.', example: '2022-01-01'})
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({description: 'The id of the person who submitted the case.', example: '77159c65-c68c-4466-b17d-f9167dc0fb8f'})
    @IsString()
    @IsOptional()
    submittedById?: string;

    @IsString()
    @IsOptional()
    submissionId?: string;
}
