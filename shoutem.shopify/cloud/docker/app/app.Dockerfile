FROM node:16.16.0

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .
RUN rm -f .env

EXPOSE ${NODE_PORT}
