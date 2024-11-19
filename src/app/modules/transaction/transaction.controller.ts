import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/app/decorators/role.decorator';
import { RBAC } from 'src/app/enums/rbac.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/')
  async createTransaction(@Body() body: CreateTransactionDto) {
    return await this.transactionService.create(body);
  }
}
