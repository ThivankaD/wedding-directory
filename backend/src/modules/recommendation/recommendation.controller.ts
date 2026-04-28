import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtVisitorAuthGuard } from 'src/modules/auth/guards/jwt-visitor-auth.guard';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @UseGuards(JwtVisitorAuthGuard)
  @Post('vendors')
  async recommendVendors(
    @Body() request: RecommendationRequestDto,
    @Req() req: { user?: { id?: string } },
  ) {
    const response = await this.recommendationService.recommendForVisitor(request);

    return {
      visitorId: req.user?.id || null,
      ...response,
    };
  }
}
