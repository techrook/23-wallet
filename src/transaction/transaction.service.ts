import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}
    async createTransaction (
        Transaction: Prisma.TransactionUncheckedCreateInput,
    ){
        const transaction = await this.prisma.transaction.create({
            data:Transaction
        })
        return  transaction
    };
    async getTransactions(){};
    async getTransaction(){};
}
