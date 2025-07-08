# Step 1: Build the app
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN ls -la /app/dist

COPY . .
RUN npm run build

# Step 2: Serve using nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and add your own if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
