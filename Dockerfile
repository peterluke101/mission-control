# Use Node 18 alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json, package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . ./

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
