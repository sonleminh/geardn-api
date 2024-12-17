# Use Node.js as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["node", "dist/main.js"]

# Expose the port the app runs on
EXPOSE 8080
