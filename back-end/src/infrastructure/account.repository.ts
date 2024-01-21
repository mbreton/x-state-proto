import { AccountRepository } from '../domain/account/gateways/account-repository';
import { Account } from 'x-state-proto-domain';
import { AccountEntity } from './account.entity';
import { ClassProvider } from '@nestjs/common';

export class PgAccountRepository implements AccountRepository {
  async findOne(options: { id?: number }): Promise<Account> {
    const result = await AccountEntity.findOne({
      where: { ...(options.id ? { id: options.id } : undefined) },
    });
    if (result === null) {
      throw new Error('Not found');
    }
    return AccountEntity.toDomain(result);
  }

  async save(account: Account): Promise<Account> {
    const result0 = await AccountEntity.fromDomain(account).save();
    return AccountEntity.toDomain(result0);
  }

  async findAll(): Promise<Account[]> {
    const entities = await AccountEntity.findAll({ order: [['id', 'ASC']] });
    return entities.map(AccountEntity.toDomain);
  }
}

export const AccountRepositoryProvider: ClassProvider<AccountRepository> = {
  provide: 'ACCOUNT_REPOSITORY',
  useClass: PgAccountRepository,
};
