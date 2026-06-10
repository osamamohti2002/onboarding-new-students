import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StepStatus } from "generated/prisma";

export class UpdateStepDto{

    @ApiProperty({description: 'the new status of the step', enum: StepStatus, example: StepStatus.PENDING})
    @IsNotEmpty()
    @IsEnum(StepStatus)
    status: StepStatus;
    
    @ApiProperty({description: 'the URL of the evidence', example: 'https://example.com/evidence.pdf'})
    @IsString()
    @IsOptional()
    evidenceUrl?: string;
    
    @ApiProperty({description: 'the date when the step was completed', example: '2022-01-01T00:00:00.000Z'})
    @IsDateString()
    @IsOptional()
    completedAt?: string;

    @ApiProperty({description: 'the ID of the user who owns the step', example: '1'})
    @IsString()
    @IsOptional()
    ownerId?: string;

    @ApiProperty({description: 'the deadline for the step', example: '2022-01-01T00:00:00.000Z'})
    @IsDateString()
    @IsOptional()
    deadline?: string;
}