FROM node:22

WORKDIR /app

COPY yarn.lock package.json ./

RUN npm config set registry https://registry.npmmirror.com

RUN yarn config set registry https://registry.npmmirror.com

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"]
