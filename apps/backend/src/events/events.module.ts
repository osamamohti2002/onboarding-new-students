import { Module } from '@nestjs/common';
import { ContractSignedHandler } from './handlers/contract-signed.handler';
import { VogValidatedHandler } from './handlers/vog-validated.handler';
import { JotformSubmissionReceivedHandler } from './handlers/jotform-submission-received.handler';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [
    ContractSignedHandler,
    VogValidatedHandler,
    JotformSubmissionReceivedHandler
  ],
})
export class EventsModule {}
