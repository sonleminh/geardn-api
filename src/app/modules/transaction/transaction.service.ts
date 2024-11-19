import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {}

  async create(data: CreateTransactionDto) {
    try {
      const { gateway,
        transactionDate,
        accountNumber,
        subAccount,
        transferType,
        transferAmount,
        accumulated,
        code,
        content,
        referenceCode, description} = data

      if (!gateway || !transactionDate || !transferAmount || !accumulated) {
        throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      }

      const amount_in = transferType === 'in' ? transferAmount : 0;
      const amount_out = transferType === 'out' ? transferAmount : 0;

      const transactionData = {
        gateway,
        transaction_date: transactionDate,
        account_number: accountNumber,
        sub_account: subAccount,
        amount_in,
        amount_out,
        accumulated,
        code,
        transaction_content: content,
        reference_number: referenceCode,
        body: description,
      };

      const savedData = await this.transactionModel.create(transactionData);
      return { success: true, data: savedData };

    } catch (error) {
      throw error;
    }
  }
}
