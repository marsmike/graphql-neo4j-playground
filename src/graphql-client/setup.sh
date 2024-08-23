#!/bin/bash

# Install the Node.js version specified in .nvmrc
nvm install

# Use the Node.js version specified in .nvmrc
nvm use

# Initialize npm project
npm init -y

# Install TypeScript and necessary packages
npm install typescript --save-dev
npm install axios ws @types/node --save-dev

# Initialize TypeScript configuration
npx tsc --init

echo "Setup complete. All dependencies are installed and tsconfig.json is configured."
