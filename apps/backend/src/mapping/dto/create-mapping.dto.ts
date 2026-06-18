import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMappingDto {
    @IsNotEmpty()
    @IsString()
    trajectType: string;

    @IsOptional()
    @IsString()
    team?: string;

    @IsOptional()
    @IsString()
    project?: string;

    @IsString()
    @IsNotEmpty()
    googleGroup: string;

    @IsString()
    @IsNotEmpty()
    slackChannel: string;

    @IsString()
    @IsOptional()
    slackUsergroup?: string;


}
