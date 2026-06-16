import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { StepStatus } from "generated/prisma";

export class UpdateStepDto{

    @IsEnum(StepStatus)
    @IsOptional()
    status?: StepStatus;

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