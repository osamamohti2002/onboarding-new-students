import { Module } from '@nestjs/common';
import { ContractSignedHandler } from './handlers/contract-signed.handler';
import { VogValidatedHandler } from './handlers/vog-validated.handler';

@Module({
  providers: [
    ContractSignedHandler,
    VogValidatedHandler
  ],
})
export class EventsModule {}
