import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'x-state-proto-domain';
import { AccountRepository } from '../gateways/account-repository';

@Injectable()
export class CloseAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  async execute(id: number): Promise<Account> {
    const foundAccount = await this.accountRepository.findOne({ id });
    const accountToSave = foundAccount.close().collect();
    return this.accountRepository.save(accountToSave);
  }
}
