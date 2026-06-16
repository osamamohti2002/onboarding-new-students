import { Injectable } from '@nestjs/common';
import { privateDecrypt } from 'crypto';
import { CasesService } from 'src/cases/cases.service';
import { PersonsService } from 'src/persons/persons.service';
import { JotformWebhookDto } from './dto/jotform-webhook.dto';
import { AuditService } from 'src/audit/audit.service';


@Injectable()
export class WebhooksService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly casesService : CasesService,
    private readonly auditService: AuditService,
  ){}

  async handelJotformSubmission(dto: JotformWebhookDto){

    try{
      // rawRequest parsen
      const raw = JSON.parse(dto.rawRequest);

      // data mappen naar interne formaat
      const firstName = raw.q3_naam?.first ?? '';
      const lastName = raw.q3_naam?.last ?? '';
      const email = raw.q4_email;
      const phone = raw.q5_telefoonnummer?.full ?? null;
      const trajectType = raw.q6_trajectType;
      const {month, day, year} = raw.q8_startdatum;
      const startDate = `${year}-${month}-${day}`;

      // Person matchen of aanmaken
      const person = await this.personsService.findOrCreate({
        firstName,
        lastName,
        email,
        phone
      });

      // onboarding case aanmaken
      const onboardingCase = await this.casesService.createCase({
        personId: person.id,
        trajectType,
        startDate,
      });

      await this.auditService.log({
        eventType: 'JOTFORM_SUBMISSION_RECEIVED',
        caseId: onboardingCase?.id ?? '',
        targetPersonId: person.id,
        result: 'SUCCESS',
        payload: { submissionID: dto.submissionID, formID: dto.formID }
      })

      return {
        message: 'onboarding case created successfully',
        caseId: onboardingCase?.id,
        person: person.id
      }
    }catch(error){
        console.log(error);
        return error;
    }

  }
    
  
}
