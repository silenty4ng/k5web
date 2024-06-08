FROM node:22 AS build-yarn

WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:latest AS runtime

COPY --from=build-yarn /app/dist/  /usr/share/nginx/html/

EXPOSE 80
