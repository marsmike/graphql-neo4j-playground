#!/bin/bash

kubectl config use-context k3d-k3s-default
kubectl config set-context --current --namespace=playground

echo "Creating image pull secrets..."
kubectl create secret generic playground-image-pull-secrets --from-file=.dockerconfigjson=$HOME/.docker/config.json --type=kubernetes.io/dockerconfigjson -n playground

echo "###########################################################################"
echo "Deploying Neo4J..."

kic local neo4j

echo "###########################################################################"
echo "Deploying GraphQL Server..."

kic local graphql

echo "Deployment finished!"
echo "###########################################################################"
