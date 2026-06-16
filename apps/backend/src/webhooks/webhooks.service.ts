import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CasesService } from 'src/cases/cases.service';
import { PersonsService } from 'src/persons/persons.service';
import { JotformWebhookDto } from './dto/jotform-webhook.dto';
import { AuditService } from 'src/audit/audit.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JotformSubmissionReceivedEvent } from 'src/events/events/jotform-submission-received.event';
import { EVENT_NAMES } from 'src/events/event-names';
import { AUDIT_EVENTS } from 'src/events/audit-events';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly casesService: CasesService,
    private readonly auditService: AuditService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async handelJotformSubmission(dto: JotformWebhookDto) {
    // rawRequest parsen
    const raw = JSON.parse(dto.rawRequest);

    // data mappen naar interne formaat
    const firstName = raw.q3_naam?.first ?? '';
    const lastName = raw.q3_naam?.last ?? '';
    const email = raw.q4_email;
    const phone = raw.q5_telefoonnummer?.full ?? null;
    const trajectType = raw.q6_trajectType;
    const { month: startMonth, day: startDay, year: startYear } = raw.q8_startdatum;
    const startDate = startMonth && startDay && startYear
      ? `${startYear}-${startMonth}-${startDay}`
      : undefined;

    // Person matchen of aanmaken
    const person = await this.personsService.upsertByEmail({
      firstName,
      lastName,
      email,
      phone
    });

    try {
      // onboarding case aanmaken
      const onboardingCase = await this.casesService.createCase({
        personId: person.id,
        trajectType,
        startDate,
        submissionId: dto.submissionID,
      });

      if (!onboardingCase) {
        throw new InternalServerErrorException('Failed to create onboarding case');
      }

      // Audit log — eigen try/catch zodat een fout de hoofdflow niet blokkeert
      try {
        await this.auditService.log({
          eventType: AUDIT_EVENTS.JOTFORM_SUBMISSION_RECEIVED,
          caseId: onboardingCase.id,
          targetPersonId: person.id,
          result: 'SUCCESS',
          payload: { submissionID: dto.submissionID, formID: dto.formID }
        });
      } catch(auditError){
        console.error('Audit log failed:', auditError);
      }

      this.eventEmitter.emit(
        EVENT_NAMES.JOTFORM_SUBMISSION_RECEIVED,
        new JotformSubmissionReceivedEvent(onboardingCase.id, person.id)
      );

      return {
        message: 'onboarding case created successfully',
        caseId: onboardingCase.id,
        person: person.id
      };

    } catch (error: any) {
      if (error?.code === 'P2002') {
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