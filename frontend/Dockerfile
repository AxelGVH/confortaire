FROM node:18

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Set the command to serve the app
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]

EXPOSE 3000
