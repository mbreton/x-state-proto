import { Account } from '../account';

export interface IAccountRepository {
  save(account: Account): Promise<Account>;

  findAll(): Promise<Account[]>;

  findOne(options: { id: number }): Promise<Account>;
}
