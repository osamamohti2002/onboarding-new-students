import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCaseDto {
    @IsString()
    @IsNotEmpty()
    personId: string;

    @IsString()
    @IsNotEmpty()
    trajectType: string;

    @IsString()
    @IsOptional()
    team?: string;

    @IsString()
    @IsOptional()
    project?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    submittedById?: string;
}
