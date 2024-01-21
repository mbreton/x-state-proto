import { Inject, Injectable } from '@nestjs/common';
import { Account, createNewAccount } from 'x-state-proto-domain';
import { AccountRepository } from '../gateways/account-repository';

@Injectable()
export class FinalizeOnboardingUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  execute(): Promise<Account> {
    const account = createNewAccount('Toto', 'FRA');
    return this.accountRepository.save(account);
  }
}
