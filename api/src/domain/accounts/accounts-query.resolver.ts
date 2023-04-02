import { PrismaClient } from '@prisma/client';

export class AccountsQueryResolver {
    constructor(private readonly prisma: PrismaClient) {}

    async accounts(): Promise<{ name: string }[]> {
        // @see https://github.com/prisma/prisma/issues/7183
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return await this.prisma.account.groupBy({ by: ['name'] });
    }

    async banks(): Promise<{ name: string }[]> {
        return (await this.prisma.account.groupBy({ by: ['bank'] })).map(it => ({ name: it.bank }));
    }
}
