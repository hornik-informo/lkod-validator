FROM node:20.9-alpine

WORKDIR /app

COPY package-lock.json .
COPY package.json .

RUN npm ci

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]