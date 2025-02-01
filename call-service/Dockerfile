# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire contents of the current directory (all files and subdirectories) into /app
COPY . .

# Expose the port the app runs on
EXPOSE 3003

# Run the application
CMD ["node", "server.js"]
