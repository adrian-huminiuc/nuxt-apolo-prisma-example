import { ApolloServerPlugin } from '@apollo/server';

export const loggerPlugin: ApolloServerPlugin = {
    async requestDidStart(ctx) {
        if (ctx.request.operationName === 'IntrospectionQuery') {
            return;
        }
        ctx.logger.info(
            'Request started! Query:\n' + ctx.request.query + '\nVariables' + JSON.stringify(ctx.request.variables),
        );
    },
};
