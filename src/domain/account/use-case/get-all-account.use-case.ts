import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../account';
import { IAccountRepository } from '../gateways/IAccountRepository';

@Injectable()
export class GetAllAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  execute(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }
}
