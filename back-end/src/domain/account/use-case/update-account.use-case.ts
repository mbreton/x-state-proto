import { Inject, Injectable } from '@nestjs/common';
import { Account, AccountCountry } from 'x-state-proto-domain';
import { IAccountRepository } from '../gateways/IAccountRepository';

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  async execute(
    id: number,
    props: UpdateAccountUseCaseParams,
  ): Promise<Account> {
    const foundAccount = await this.accountRepository.findOne({ id: id });

    const accountToSave = foundAccount
      .wrap()
      .dispatch({ type: 'SET_PROPS', params: props }, false)
      .unwrap();
    return this.accountRepository.save(accountToSave);
  }
}

export class UpdateAccountUseCaseParams {
  public name?: string;
  public country?: AccountCountry;
}
