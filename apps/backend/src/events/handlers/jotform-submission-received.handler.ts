import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AuditService } from "src/audit/audit.service";
import { JotformSubmissionReceivedEvent } from "../events/jotform-submission-received.event";
import { EVENT_NAMES } from "../event-names";

@Injectable()
export class JotformSubmissionReceivedHandler{
    constructor(private readonly auditService: AuditService){}

    @OnEvent(EVENT_NAMES.JOTFORM_SUBMISSION_RECEIVED)
    async handle(event: JotformSubmissionReceivedEvent){
        try{
            await this.auditService.log({
                eventType: EVENT_NAMES.JOTFORM_SUBMISSION_RECEIVED,
                caseId: event.caseId,
                targetPersonId: event.personId,
                result: 'SUCCESS'
            });
        }catch(error){
            console.log('Audit log failed in JotformSubmissionReceivedHandler:', error)
        }
        
    }
}