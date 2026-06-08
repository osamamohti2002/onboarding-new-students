import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {}
