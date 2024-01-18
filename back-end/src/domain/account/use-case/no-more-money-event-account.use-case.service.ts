import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'x-state-proto-domain';
import { IAccountRepository } from '../gateways/IAccountRepository';

@Injectable()
export class NoMoreMoneyEventAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  async execute(id: number): Promise<Account> {
    const accountFound = await this.accountRepository.findOne({ id });
    try {
      const accountToSave = accountFound
        .wrap()
        .dispatch({ type: 'NO_MORE_MONEY_ON_ACCOUNT' })
        .unwrap();
      return this.accountRepository.save(accountToSave);
    } catch {
      throw new Error('Unable to close account');
    }
  }
}
