# Start from the official Node.js LTS base image
FROM node:20.15.1

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the port the app runs on
EXPOSE 8081
EXPOSE 8082

# Run the application
CMD ["node", "dist/server.js"]
