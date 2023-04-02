import { GraphQLScalarType } from 'graphql/type';

export const DateScalarType = new GraphQLScalarType({
    name: 'Date',
    parseValue(value: string): Date {
        return new Date(value);
    },
    serialize(value: Date): string {
        return new Date(value).toISOString();
    },
});
