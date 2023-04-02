import { TransactionsQueryResolver } from './transactions/transactions-query.resolver';
import { PrismaClient } from '@prisma/client';
import { TransactionsMutationResolver } from './transactions/transactions-mutation.resolver';
import { AccountsQueryResolver } from './accounts/accounts-query.resolver';
import { CategoriesQueryResolver } from './categories/categories-query.resolver';
import { CategoriesMutationResolver } from './categories/categories-mutation.resolver';

const prisma = new PrismaClient(/*{ log: ['query', 'error'] }*/);

export class DomainRegistry {
    queryResolvers() {
        return [
            new TransactionsQueryResolver(prisma),
            new AccountsQueryResolver(prisma),
            new CategoriesQueryResolver(prisma),
        ];
    }

    mutationResolvers() {
        return [new TransactionsMutationResolver(prisma), new CategoriesMutationResolver(prisma)];
    }
}
