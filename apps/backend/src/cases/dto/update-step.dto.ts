import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StepStatus } from "generated/prisma";

export class UpdateStepDto{
    @IsNotEmpty()
    @IsEnum(StepStatus)
    status: StepStatus;
    
    @IsString()
    @IsOptional()
    evidenceUrl?: string;

    @IsDateString()
    @IsOptional()
    completedAt?: string;

    @IsString()
    @IsOptional()
    ownerId?: string;

    @IsDateString()
    @IsOptional()
    deadline?: string;
}