import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { ContractSignedEvent } from '../events/contract-signed.event';


@Injectable()
export class ContractSignedHandler {
  private readonly logger = new Logger(ContractSignedHandler.name);

  @OnEvent('contract.signed')
  async handle(event: ContractSignedEvent) {
    // Google provisioning komt in Sprint 3
    this.logger.log(`Contract signed for case ${event.caseId} — Google provisioning pending`);
  }
}