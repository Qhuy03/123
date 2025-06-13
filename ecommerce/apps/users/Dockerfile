FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY ./../../package*.json ./

RUN npm install --legacy-peer-deps

# COPY . ./apps
COPY ../apps ./apps
COPY ./../../libs ./libs
COPY ../../nest-cli.json ./nest-cli.json
COPY ../../tsconfig.build.json ./tsconfig.build.json
COPY ../../tsconfig.json ./tsconfig.json
COPY ../../.env ./.env
EXPOSE 5000

CMD ["npm", "start", "users", "--watch"]
