import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../account';
import { IAccountRepository } from '../gateways/IAccountRepository';

@Injectable()
export class ReopenAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  async execute(id: number): Promise<Account> {
    const foundAccount = await this.accountRepository.findOne({ id });
    const accountToSave = foundAccount
      .wrap()
      .dispatch({ type: 'REOPEN' })
      .unwrap();
    return this.accountRepository.save(accountToSave);
  }
}
