# Use full Node image with Debian for easy language support
FROM node:18

# Set working directory
WORKDIR /app

# Install system compilers/interpreters
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    openjdk-17-jdk \
    && apt-get clean

# Copy dependencies first
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose your server port
EXPOSE 5001

# Run your app
CMD ["node", "index.js"]
