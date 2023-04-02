import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import pkg from 'body-parser';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { loggerPlugin } from './core/util/logger.plugin';
import { resolvers } from './resolvers';

const typeDefs = readFileSync(join(process.cwd(), 'src', 'schema.graphql'), { encoding: 'utf-8' });

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), loggerPlugin],
});

await server.start();

app.use('/graphql', cors<cors.CorsRequest>({ origin: '*' }), pkg.json(), expressMiddleware(server));

await new Promise<void>(resolve => httpServer.listen({ port: Number(process.env.API_PORT) }, resolve));

console.log(`🚀 Server ready at http://ffdc-api.localhost`);
