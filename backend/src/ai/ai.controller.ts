import { Controller, Get, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @UseGuards(AuthGuard)
  @Get('insights')
  weatherInsight() {
    return this.aiService.weatherInsight();
  }
}
