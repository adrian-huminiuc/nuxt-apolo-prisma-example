import {endOfDay, endOfMonth, isValid, parse, startOfDay, startOfMonth} from 'date-fns';
import { PrismaClient, Transaction } from '@prisma/client';
import { GraphQLError } from 'graphql/index';

export class TransactionsQueryResolver {
    private resultsPerPage = 10;

    constructor(private readonly prisma: PrismaClient) {}

    async transaction(parent, args: { id: string }): Promise<Transaction> {
        if (!args.id) {
            throw new GraphQLError('validation_unknown_transaction_id');
        }

        return this.prisma.transaction.findFirstOrThrow({
            where: { id: args.id },
            include: { account: true, category: true },
        });
    }

    async transactions(
        parent,
        args: {
            id?: string;
            search: string;
            filterBy: {
                bank: string;
                account: string;
                startMonth: string;
                endMonth: string;
            };
            orderBy: { field: string; dir: 'asc' | 'desc' };
            pagination: { page: number };
        },
    ): Promise<Transaction[]> {
        const filterByAccountOrBank = args.filterBy.bank || args.filterBy.account;
        const [endYear, endMonth] = args.filterBy.endMonth.split('-');
        const [startYear, startMonth] = args.filterBy.startMonth.split('-');
        const parsedDate = parse(args.search, 'dd-MM-yyyy', new Date());
        const endOfParsedDate = endOfDay(parsedDate);
        const startOfParsedDate = startOfDay(parsedDate);
        //query parts
        const sameDaySearch = { date: { lte: endOfParsedDate, gte: startOfParsedDate } };
        const startMonthDate = args.filterBy.startMonth ? startOfDay(startOfMonth(new Date(Number(startYear), Number(startMonth), 0))) : false;
        const endMonthDate = args.filterBy.endMonth ? endOfDay(endOfMonth(new Date(Number(endYear), Number(endMonth), 0))) : false;

        let results = [];
        try {
            //todo rewrite this with a raw query for "better" performance
            results = await this.prisma.transaction.findMany({
                take: this.resultsPerPage,
                skip: ((args.pagination.page ?? 1) - 1) * this.resultsPerPage,
                include: { account: true, category: true },
                orderBy: { [args.orderBy.field]: args.orderBy.dir },
                where: {
                    date: {
                        ...(endMonthDate && { lte: endMonthDate }),
                        ...(startMonthDate && { gte: startMonthDate }),
                    },
                    ...(args.search.length > 0 && {
                        OR: [
                            ...(Number.isFinite(Number(args.search)) ? [{ amount: args.search }] : []),
                            { reference: { contains: args.search, mode: 'insensitive' } }, // covered by gist index
                            ...(isValid(parsedDate) ? [sameDaySearch] : []),
                            { category: { name: { contains: args.search, mode: 'insensitive' } } },
                        ],
                    }),
                    ...(filterByAccountOrBank && {
                        account: {
                            is: {
                                ...(args.filterBy.account && { name: args.filterBy.account }),
                                ...(args.filterBy.bank && { bank: args.filterBy.bank }),
                            },
                        },
                    }),
                },
            });
        } catch (e) {
            console.error(e);
        }
        return results;
    }
}
