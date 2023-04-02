import { Category, PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql/index';

export class CategoriesMutationResolver {
    constructor(private readonly prisma: PrismaClient) {}

    async addCategory(
        prev,
        {
            input,
        }: {
            input: {
                name: string;
                color: string;
            };
        },
    ): Promise<Category> {
        if (input.name.length < 3) {
            throw new GraphQLError(`validation_category_name_too_short`);
        }

        if (input.color.length < 3 || !input.color.startsWith('#')) {
            throw new GraphQLError('validation_category_color_invalid_color');
        }

        return this.prisma.category.create({
            data: {
                name: input.name,
                color: input.color.replace('#', ''),
            },
        });
    }
}
