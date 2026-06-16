import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PersonsModule } from 'src/persons/persons.module';
import { CasesModule } from 'src/cases/cases.module';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [PersonsModule, CasesModule, AuditModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
