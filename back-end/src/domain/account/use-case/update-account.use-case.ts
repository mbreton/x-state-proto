import { Inject, Injectable } from '@nestjs/common';
import { Account, AccountCountry } from 'x-state-proto-domain';
import { AccountRepository } from '../gateways/account-repository';

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  async execute(
    id: number,
    props: UpdateAccountUseCaseParams,
  ): Promise<Account> {
    const foundAccount = await this.accountRepository.findOne({ id: id });
    const accountToSave = foundAccount.set(props).collect();
    return this.accountRepository.save(accountToSave);
  }
}

export class UpdateAccountUseCaseParams {
  public name?: string;
  public country?: AccountCountry;
}
