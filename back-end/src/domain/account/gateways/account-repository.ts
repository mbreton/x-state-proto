import { Account } from 'x-state-proto-domain';

export interface AccountRepository {
  save(account: Account): Promise<Account>;

  findAll(): Promise<Account[]>;

  findOne(options: { id: number }): Promise<Account>;
}
