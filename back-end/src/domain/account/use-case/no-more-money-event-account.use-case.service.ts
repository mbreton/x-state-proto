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
    const accountToSave = accountFound
      .unseal()
      .dispatch({ type: 'NO_MORE_MONEY_ON_ACCOUNT' })
      .collect();
    return this.accountRepository.save(accountToSave);
  }
}
