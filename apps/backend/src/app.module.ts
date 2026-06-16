import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { CasesModule } from './cases/cases.module';
import { PersonsModule } from './persons/persons.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AuditModule } from './audit/audit.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    WebhooksModule,
    CasesModule,
    PersonsModule,
    WorkflowModule,
    AuditModule,
    EventsModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },{
    provide: APP_GUARD,
    useClass:RolesGuard,
  }]
})
export class AppModule {}
