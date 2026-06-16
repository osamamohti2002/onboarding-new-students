import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class JotformWebhookDto {
    
    @ApiProperty({description: 'the id of the form', example: '123456789'})
    @IsString()
    @IsNotEmpty()
    formID: string;

    @ApiProperty({description: 'the id of the submission', example: '123456789'})
    @IsString()
    @IsNotEmpty()
    submissionID: string;

    @ApiProperty({description: 'the raw request of the submission', example: '{"questions": [{"id": "1", "text": "First Name", "value": "John"}, {"id": "2", "text": "Last Name", "value": "Doe"}, {"id": "3", "text": "Email", "value": "[EMAIL_ADDRESS]"}, {"id": "4", "text": "Phone", "value": "1234567890"}], "answers": {"1": "John", "2": "Doe", "3": "[EMAIL_ADDRESS]", "4": "1234567890"}, "status": "complete", "created_at": "2022-01-01T00:00:00.000Z", "updated_at": "2022-01-01T00:00:00.000Z", "id": "123456789", "form_id": "123456789"}'})
    @IsString()
    @IsNotEmpty()
    rawRequest: string;
    
    
}