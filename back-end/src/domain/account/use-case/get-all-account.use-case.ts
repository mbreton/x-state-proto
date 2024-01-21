import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'x-state-proto-domain';
import { AccountRepository } from '../gateways/account-repository';

@Injectable()
export class GetAllAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  execute(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }
}
