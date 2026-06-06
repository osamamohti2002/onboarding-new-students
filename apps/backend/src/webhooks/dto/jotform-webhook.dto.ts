import { IsNotEmpty, IsString } from "class-validator";

export class JotformWebhookDto {
    
    @IsString()
    @IsNotEmpty()
    formID: string;

    @IsString()
    @IsNotEmpty()
    submissionID: string;

    @IsString()
    @IsNotEmpty()
    rawRequest: string;
    
    
}