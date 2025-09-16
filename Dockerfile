# Use Node.js 20 (Next.js supports 18+, but 20 is better)
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Run the Next.js server
CMD ["npm", "start"]
