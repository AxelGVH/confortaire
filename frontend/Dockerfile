# Step 1: Build
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy only the necessary app files
COPY src ./src
COPY index.html .
COPY vite.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY package-lock.json .
COPY package.json .

COPY .env .

RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
