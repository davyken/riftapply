# Base image
FROM node:alpine AS builder

# Create app directory
WORKDIR /app

# Copy the server package files
COPY server/package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source from the server directory
COPY server/ .

# Build the app
RUN npm run build

# Production image
FROM node:alpine

WORKDIR /app

# Copy the server package files again for production
COPY server/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main" ]
