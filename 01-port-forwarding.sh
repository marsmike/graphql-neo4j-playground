#!/bin/bash

# Call this script when all pods/services are running

echo "###########################################################################"
echo "Trigger port forwarding..."

# Remove old instances
killall -9 kubectl

echo "forwarding Neo4J ports..."
nohup kubectl port-forward --address 0.0.0.0 svc/neo4j-neo4j 7474:7474 7473:7473 7687:7687 6362:6362 > /dev/null 2>&1 &

echo "forwarding GraphQL-Server ports..."
nohup kubectl port-forward --address 0.0.0.0 svc/graphql-service 8081:8081 8082:8082 > /dev/null 2>&1 &

echo "... finished!"
echo "###########################################################################"
