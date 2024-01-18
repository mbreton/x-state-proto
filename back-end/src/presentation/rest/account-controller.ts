import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GetAllAccountUseCase } from '../../domain/account/use-case/get-all-account.use-case';
import { CloseAccountUseCase } from '../../domain/account/use-case/close-account.use-case';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { NoMoreMoneyEventAccountUseCase } from '../../domain/account/use-case/no-more-money-event-account.use-case.service';
import { ReopenAccountUseCase } from '../../domain/account/use-case/reopen-account.use-case';
import {
  UpdateAccountUseCase,
  UpdateAccountUseCaseParams,
} from '../../domain/account/use-case/update-account.use-case';
import { InspectAccountUseCase } from '../../domain/account/use-case/inspect-account.use-case';
import type { Snapshot } from 'xstate/dist/declarations/src/types';
import { Account } from 'x-state-proto-domain';

@Controller('account')
export class AccountController {
  constructor(
    private readonly getAllAccount: GetAllAccountUseCase,
    private readonly closeAccount: CloseAccountUseCase,
    private readonly reopenAccount: ReopenAccountUseCase,
    private readonly inspectAccount: InspectAccountUseCase,
    private readonly updateAccount: UpdateAccountUseCase,
    private readonly noMoreMoney: NoMoreMoneyEventAccountUseCase,
  ) {}

  @Get()
  async getAll(): Promise<Account[]> {
    return this.getAllAccount.execute();
  }

  @Post(':id/close')
  @ApiParam({ name: 'id', type: 'string' })
  async close(@Param() { id }: { id: number }): Promise<Account> {
    try {
      return await this.closeAccount.execute(id);
    } catch (err) {
      throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED, {
        cause: err,
      });
    }
  }

  @Get(':id/inspect')
  @ApiParam({ name: 'id', type: 'string' })
  async inspect(
    @Param() { id }: { id: number },
  ): Promise<{ snapshot: Snapshot<unknown> }> {
    return await this.inspectAccount.execute(id);
  }

  @Post(':id/reopen')
  @ApiParam({ name: 'id', type: 'string' })
  async reopen(@Param() { id }: { id: number }): Promise<Account> {
    try {
      return await this.reopenAccount.execute(id);
    } catch (err) {
      throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED, {
        cause: err,
      });
    }
  }

  @Post(':id/simulate-no-more-money-event')
  @ApiParam({ name: 'id', type: 'string' })
  async simulateNoMoreMoney(@Param() { id }: { id: number }): Promise<Account> {
    try {
      return await this.noMoreMoney.execute(id);
    } catch (err) {
      throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED, {
        cause: err,
      });
    }
  }

  @Post(':id/update')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateAccountUseCaseParams })
  async simulaiteNoMoreMoneyEvent(
    @Param() { id }: { id: number },
    @Body() params: UpdateAccountUseCaseParams,
  ): Promise<Account> {
    return this.updateAccount.execute(id, params);
  }
}
