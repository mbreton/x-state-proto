import { Controller, HttpCode, Post } from '@nestjs/common';
import { FinalizeOnboardingUseCase } from '../../domain/account/use-case/finalize-onboarding.use-case';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly finalizeOnboardingUseCase: FinalizeOnboardingUseCase,
  ) {}

  @Post('finalize')
  @HttpCode(204)
  async finalizeOnboarding(): Promise<string> {
    await this.finalizeOnboardingUseCase.execute();
    return 'Onboarding finalized, account created';
  }
}
