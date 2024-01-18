import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../gateways/IAccountRepository';
import type { Snapshot } from 'xstate/dist/declarations/src/types';

@Injectable()
export class InspectAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: IAccountRepository,
  ) {}

  async execute(id: number): Promise<{ snapshot: Snapshot<unknown> }> {
    const foundAccount = await this.accountRepository.findOne({ id: id });
    return { snapshot: foundAccount.wrap().getPersistedSnapshot() };
  }
}
