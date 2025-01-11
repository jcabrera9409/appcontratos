# Use an official Node.js image to build the frontend
FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Use Apache as the web server
FROM httpd:alpine
COPY --from=build /app/dist/appcontratos-frontal /usr/local/apache2/htdocs/
