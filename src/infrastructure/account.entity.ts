import {
  Account,
  AccountCountry,
  AccountStatus,
} from '../domain/account/account';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'Account' })
export class AccountEntity extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id!: number;

  @Column
  @Column(DataType.STRING)
  name!: string;

  @Column
  @Column(DataType.STRING)
  country!: AccountCountry;

  @Column
  @Column(DataType.STRING)
  status!: AccountStatus;

  static fromDomain({ id, name, country, status }: Account): AccountEntity {
    return AccountEntity.build(
      {
        id: id || undefined,
        name,
        country,
        status,
      },
      {
        isNewRecord: !id,
      },
    );
  }

  static toDomain({ id, name, country, status }: AccountEntity): Account {
    return new Account({
      id,
      name,
      country,
      status,
    });
  }
}
