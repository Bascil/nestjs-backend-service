# Stage 1: Build the NestJS application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager (npm or yarn)
COPY package*.json ./
RUN npm ci --only=production

# Copy all necessary files for the build
COPY . .

# Build the NestJS project
RUN npm run build

# Stage 2: Create the final image with the production build
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the build from the builder stage
COPY --from=builder /app/dist ./dist

# Copy any other necessary files (e.g., configuration files)
COPY --from=builder /app/.env ./

# Expose the application port (ensure this matches your app configuration)
EXPOSE 3000

# Define the command to run the app
CMD ["node", "dist/main"]

# Optional: Set the NODE_ENV to production for better performance
ENV NODE_ENV=production
