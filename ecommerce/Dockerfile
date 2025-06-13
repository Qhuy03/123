FROM node:20-slim

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install --legacy-peer-deps

COPY ./ ./


CMD ["npm", "start", "products"]
