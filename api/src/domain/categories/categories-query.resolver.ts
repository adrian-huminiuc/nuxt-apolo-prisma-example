import { Category, PrismaClient } from '@prisma/client';

export class CategoriesQueryResolver {
    private resultsPerPage = 10;

    constructor(private readonly prisma: PrismaClient) {}

    async categories(
        parent,
        args: {
            categoryName: string;
            pagination: { page: number };
        },
    ): Promise<Category[]> {
        return this.prisma.category.findMany({
            take: this.resultsPerPage,
            where: {
                ...(args.categoryName.length > 0 && {
                    name: {
                        contains: args.categoryName,
                        mode: 'insensitive',
                    },
                }),
            },
        });
    }
}
