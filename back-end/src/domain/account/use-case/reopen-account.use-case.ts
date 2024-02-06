import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'x-state-proto-domain';
import { AccountRepository } from '../gateways/account-repository';

@Injectable()
export class ReopenAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  async execute(id: number): Promise<Account> {
    const foundAccount = await this.accountRepository.findOne({ id });
    const accountToSave = foundAccount
      .unseal()
      .dispatch({ type: 'REOPEN' })
      .collect();
    return this.accountRepository.save(accountToSave);
  }
}
