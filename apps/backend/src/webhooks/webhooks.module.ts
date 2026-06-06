import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PersonsModule } from 'src/persons/persons.module';
import { CasesModule } from 'src/cases/cases.module';

@Module({
  imports: [PersonsModule, CasesModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
