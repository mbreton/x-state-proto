import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'x-state-proto-domain';
import { IAccountRepository } from '../gateways/IAccountRepository';

@Injectable()
export class CloseAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  async execute(id: number): Promise<Account> {
    const foundAccount = await this.accountRepository.findOne({ id });
    const accountToSave = foundAccount
      .wrap()
      .dispatch({ type: 'CLOSE' })
      .unwrap();
    return this.accountRepository.save(accountToSave);
  }
}
