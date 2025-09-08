# Use Node LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy package manifests first (for better layer caching)
COPY package*.json ./

# Install dependencies (use npm ci if lockfile exists)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy app source
COPY . .

# If you have a build step (optional), uncomment:
# RUN npm run build

# Ensure a default PORT value (app should still read process.env.PORT)
ENV PORT=3000
EXPOSE 3000

# Start the app (must match package.json "start" script)
CMD ["npm", "start"]
