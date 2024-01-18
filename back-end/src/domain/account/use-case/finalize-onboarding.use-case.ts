import { Inject, Injectable } from '@nestjs/common';
import { Account, createNewAccount } from 'x-state-proto-domain';
import { IAccountRepository } from '../gateways/IAccountRepository';

@Injectable()
export class FinalizeOnboardingUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  execute(): Promise<Account> {
    const account = createNewAccount('Toto', 'FRA');
    return this.accountRepository.save(account);
  }
}
