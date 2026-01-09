# Stage 1: Bauen der App
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Ausliefern mit Nginx
FROM nginx:alpine
# Kopiere die gebaute App aus Stage 1
COPY --from=build /app/dist /usr/share/nginx/html
# Kopiere unsere Nginx Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]