import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OnboardingController } from './presentation/rest/onboarding-controller';
import { FinalizeOnboardingUseCase } from './domain/account/use-case/finalize-onboarding.use-case';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { GetAllAccountUseCase } from './domain/account/use-case/get-all-account.use-case';
import { AccountController } from './presentation/rest/account-controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './presentation/TransformInterceptor';
import { CloseAccountUseCase } from './domain/account/use-case/close-account.use-case';
import { NoMoreMoneyEventAccountUseCase } from './domain/account/use-case/no-more-money-event-account.use-case.service';
import { ReopenAccountUseCase } from './domain/account/use-case/reopen-account.use-case';
import { UpdateAccountUseCase } from './domain/account/use-case/update-account.use-case';
import { InspectAccountUseCase } from './domain/account/use-case/inspect-account.use-case';

@Module({
  imports: [InfrastructureModule],
  controllers: [AppController, OnboardingController, AccountController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    AppService,
    FinalizeOnboardingUseCase,
    GetAllAccountUseCase,
    CloseAccountUseCase,
    ReopenAccountUseCase,
    UpdateAccountUseCase,
    InspectAccountUseCase,
    NoMoreMoneyEventAccountUseCase,
  ],
})
export class AppModule {}
