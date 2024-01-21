import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'x-state-proto-domain';
import { AccountRepository } from '../gateways/account-repository';

@Injectable()
export class NoMoreMoneyEventAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  async execute(id: number): Promise<Account> {
    const accountFound = await this.accountRepository.findOne({ id });
    try {
      const accountToSave = accountFound
        .unlock()
        .dispatch({ type: 'NO_MORE_MONEY_ON_ACCOUNT' })
        .collect();
      return this.accountRepository.save(accountToSave);
    } catch {
      throw new Error('Unable to close account');
    }
  }
}
