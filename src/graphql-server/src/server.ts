import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from 'body-parser';
import cors from "cors";
import { createServer } from "http";
import neo4j from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { toGraphQLTypeDefs } from "@neo4j/introspector";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 8082; // Apollo server port

// Load Neo4j connection parameters from environment variables
const neo4jUrl = process.env.NEO4J_CONNECTION_URL;
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD;

if (!neo4jPassword) {
    console.error('NEO4J_PASSWORD environment variable is required');
    process.exit(1);
}

console.log('Starting server with the following Neo4j connection parameters:');
console.log(`Neo4j URL: ${neo4jUrl}`);
console.log(`Neo4j User: ${neo4jUser}`);

const driver = neo4j.driver(neo4jUrl, neo4j.auth.basic(neo4jUser, neo4jPassword));

// Create a session factory for the introspector
const sessionFactory = () => driver.session({ defaultAccessMode: neo4j.session.READ });

async function main() {
    const app = express();
    const httpServer = createServer(app);

    // Generate schema from database introspection
    console.log('Introspecting Neo4j database...');
    const typeDefs = await toGraphQLTypeDefs(sessionFactory);
    console.log('Generated GraphQL schema:');
    console.log(typeDefs);
    console.log('Generated GraphQL schema from database structure');

    const neoSchema = new Neo4jGraphQL({
        typeDefs,
        driver,
    });

    const schema = await neoSchema.getSchema();
    console.log('Neo4j GraphQL schema initialized');

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    });

    await server.start();
    app.use(
        '/', 
        cors(), 
        bodyParser.json(), 
        expressMiddleware(server, {
            context: async ({ req }) => ({ req })
        })
    );

    httpServer.listen(PORT, () => {
        console.log(`🚀 Apollo Server ready at http://localhost:${PORT}`);
    });
}

main().catch(error => {
    console.error('Error starting server:', error);
    process.exit(1);
});