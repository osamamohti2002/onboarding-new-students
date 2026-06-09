import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { ContractSignedEvent } from '../events/contract-signed.event';
import { EVENT_NAMES } from '../event-names';


@Injectable()
export class ContractSignedHandler {
  private readonly logger = new Logger(ContractSignedHandler.name);

  @OnEvent(EVENT_NAMES.CONTRACT_SIGNED)
  async handle(event: ContractSignedEvent) {
    // Google provisioning komt in Sprint 3
    this.logger.log(`Contract signed for case ${event.caseId} — Google provisioning pending`);
  }
}