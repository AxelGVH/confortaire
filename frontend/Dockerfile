# Step 1: Build the app
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .             # Copy everything including src/, index.html, etc.
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default config if desired (optional)
RUN rm /etc/nginx/conf.d/default.conf

# Optional: Custom config (recommended)
# COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
