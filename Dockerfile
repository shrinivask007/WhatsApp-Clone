# Use Node.js 18 LTS as base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application files to the container
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
