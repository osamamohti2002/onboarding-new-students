import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CasesService } from 'src/cases/cases.service';
import { PersonsService } from 'src/persons/persons.service';
import { JotformWebhookDto } from './dto/jotform-webhook.dto';


@Injectable()
export class WebhooksService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly casesService : CasesService,
  ){}


  async handelJotformSubmission(dto: JotformWebhookDto){

    // rawRequest parsen
    const raw = JSON.parse(dto.rawRequest);

    // data mappen naar interne formaat
    const firstName = raw.q3_naam?.first ?? '';
    const lastName = raw.q3_naam?.last ?? '';
    const email = raw.q4_email;
    const phone = raw.q5_telefoonnummer?.full ?? null;
    const trajectType = raw.q6_trajectType;
    const {month: startMonth, day: startDay, year: startYear} = raw.q8_startdatum;
    const startDate = startMonth && startDay && startYear
     ? `${startYear}-${startMonth}-${startDay}`
     : undefined;

    // Person matchen of aanmaken
    const person = await this.personsService.findOrCreate({
      firstName,
      lastName,
      email,
      phone
    });

    try{
      // onboarding case aanmaken
      const onboardingCase = await this.casesService.createCase({
        personId: person.id,
        trajectType,
        startDate,
        submissionId: dto.submissionID,
      });
      
      if(!onboardingCase){
        throw new InternalServerErrorException('Failed to create onboarding case');
      };

      return {
        message: 'onboarding case created successfully',
        caseId: onboardingCase?.id,
        person: person.id
      };
    }catch(error){
      if(error?.code === 'P2002'){
        const existCase = await this.casesService.findCaseBySubmissionId(dto.submissionID);
        return {
          message: 'Submission already processed',
          caseId: existCase?.id,
          person: existCase?.personId,
        };
      }
      throw error;

    }
    
  } 
}
