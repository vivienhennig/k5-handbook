# Stage 1: Bauen der App
FROM node:18-alpine as build
WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm ci

# Source Code kopieren und bauen
COPY . .
RUN npm run build
# Das Ergebnis liegt jetzt in /app/dist (weil Vite genutzt wird)

# Stage 2: Ausliefern mit Nginx
FROM nginx:alpine

# 1. Nginx Config an die richtige Stelle kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Gebaute App aus Stage 1 kopieren
COPY --from=build /app/dist /usr/share/nginx/html

# 3. WICHTIG: Berechtigungen setzen (Fix für 502 Fehler)
# Damit der Nginx-User die Dateien auch wirklich lesen darf
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
