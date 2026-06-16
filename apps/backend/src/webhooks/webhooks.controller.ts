import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Public } from 'src/common/decorators/public.decorator';
import { JotformWebhookDto } from './dto/jotform-webhook.dto';
import { UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('jotform')
  @HttpCode(200)
  @UseInterceptors(AnyFilesInterceptor())
  handleJotformSubmission(@Body() data: JotformWebhookDto){
    return this.webhooksService.handelJotformSubmission(data)
  }

 
}
