import { DateScalarType } from './core/graphql/date-scalar-type';
import { getObjectMethods } from './core/util/object.helper';
import { DomainRegistry } from './domain/domain.registry';

const domainRegistry = new DomainRegistry();

export const resolvers = {
    Date: DateScalarType,
    Query: {
        //load modules from the classes
        ...domainRegistry.queryResolvers().reduce((acc, queryResolver) => {
            getObjectMethods(queryResolver).map(it => (acc[it] = queryResolver[it].bind(queryResolver)));
            return acc;
        }, {}),
    },
    Mutation: {
        ...domainRegistry.mutationResolvers().reduce((acc, queryResolver) => {
            getObjectMethods(queryResolver).map(it => (acc[it] = queryResolver[it].bind(queryResolver)));
            return acc;
        }, {}),
    },
};
