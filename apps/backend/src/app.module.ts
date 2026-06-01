import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { CasesModule } from './cases/cases.module';
import { PersonsModule } from './persons/persons.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AuditModule } from './audit/audit.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [AuthModule, WebhooksModule, CasesModule, PersonsModule, WorkflowModule, AuditModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
