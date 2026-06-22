FROM node:22 AS build-npm

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest AS runtime

COPY --from=build-npm /app/dist/  /usr/share/nginx/html/

EXPOSE 80
