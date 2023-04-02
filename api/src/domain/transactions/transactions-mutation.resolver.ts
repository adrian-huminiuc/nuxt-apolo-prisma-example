import { PrismaClient, Transaction } from '@prisma/client';
import { GraphQLError } from 'graphql/index';

export class TransactionsMutationResolver {
    constructor(private readonly prisma: PrismaClient) {}

    async setCategory(_, { input }): Promise<Transaction> {
        if (!(await this.prisma.transaction.findFirst({ where: { id: input.transactionId } }))) {
            throw new GraphQLError('validation_unknown_transaction_id');
        }

        if (!(await this.prisma.category.findFirst({ where: { id: input.categoryId } }))) {
            throw new GraphQLError('validation_unknown_category_id');
        }

        return this.prisma.transaction.update({
            where: {
                id: input.transactionId,
            },
            data: {
                categoryId: input.categoryId,
            },
        });
    }
}
