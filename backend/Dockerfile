# Step 1: Use official Node.js Alpine base image
FROM node:18-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Install pnpm globally inside container
RUN npm install -g pnpm

# Step 4: Copy package manifest files first for caching
COPY package.json pnpm-lock.yaml* ./

# Step 5: Install dependencies
RUN pnpm install

# Step 6: Copy the rest of the backend source code
COPY . .

# Step 7: Compile TypeScript to JavaScript (creates dist/ folder)
RUN pnpm run build

# Step 8: Expose backend port
EXPOSE 5000

# Step 9: Start the compiled JavaScript server
CMD ["node", "dist/server.js"]