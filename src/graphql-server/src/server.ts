import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from 'body-parser';
import cors from "cors";
import { createServer } from "http";
import neo4j from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const PORT1 = 8081; // WebSocket and HTTP server for queries, mutations, and subscriptions
const PORT2 = 8082; // Standalone Apollo server for browser queries

// Load typeDefs from schema.graphql file
const typeDefs = fs.readFileSync('./schema.graphql', 'utf8');

// Load Neo4j connection parameters from environment variables
const neo4jUrl = process.env.NEO4J_CONNECTION_URL || 'neo4j://localhost:7687';
const neo4jUser = process.env.NEO4J_USER || 'username';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'password';

console.log('Starting server with the following Neo4j connection parameters:');
console.log(`Neo4j URL: ${neo4jUrl}`);
console.log(`Neo4j User: ${neo4jUser}`);

const driver = neo4j.driver(neo4jUrl, neo4j.auth.basic(neo4jUser, neo4jPassword));

const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    features: {
        subscriptions: true
    },
});

async function main() {
    const app = express();
    const httpServer = createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
        handleProtocols: (protocols: Set<string>) => {
            return protocols.has('graphql-ws') ? 'graphql-ws' : false;
        }
    });

    const schema = await neoSchema.getSchema();

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({
                httpServer
            }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();

    app.use(
        "/",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ req })
        })
    );

    httpServer.listen(PORT1, () => {
        console.log(`🚀 Query and Mutation endpoint ready at http://localhost:${PORT1}/`);
        console.log(`🚀 WebSocket Subscription endpoint ready at ws://localhost:${PORT1}/`);
    });

    // Setup standalone ApolloServer for browser queries
    const standaloneApp = express();
    const standaloneHttpServer = createServer(standaloneApp);

    const standaloneServer = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer: standaloneHttpServer }),
        ],
    });

    await standaloneServer.start();
    standaloneApp.use(
        '/', 
        cors(), 
        bodyParser.json(), 
        expressMiddleware(standaloneServer, {
        context: async ({ req }) => ({ req })
    }));

    standaloneHttpServer.listen(PORT2, () => {
        console.log(`🚀 Standalone Apollo Server ready at http://localhost:${PORT2}`);
    });
}

main();