import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../gateways/account-repository';
import type { Snapshot } from 'xstate/dist/declarations/src/types';

@Injectable()
export class InspectAccountUseCase {
  constructor(
    @Inject('ACCOUNT_REPOSITORY') private accountRepository: AccountRepository,
  ) {}

  async execute(id: number): Promise<{ snapshot: Snapshot<unknown> }> {
    const foundAccount = await this.accountRepository.findOne({ id: id });
    return { snapshot: foundAccount.unlock().getPersistedSnapshot() };
  }
}
