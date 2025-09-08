# Use Node.js LTS
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy server package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY server/. .

# Expose port (Render injects PORT automatically)
EXPOSE 3000

# Start the server (must match scripts in server/package.json)
CMD ["npm", "start"]
