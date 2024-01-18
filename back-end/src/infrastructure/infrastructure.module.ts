import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountRepositoryProvider } from './account.repository';
import { AccountEntity } from './account.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountEntity]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'x-state-proto',
      autoLoadModels: true,
      synchronize: true,
    }),
  ],

  providers: [AccountRepositoryProvider],
  exports: [AccountRepositoryProvider],
})
export class InfrastructureModule {}
