FROM node:16.20.0-alpine3.18

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .
RUN rm -f .env

EXPOSE ${NODE_PORT}
