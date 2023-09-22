# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /backend/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose port 5000 to the outside world
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
