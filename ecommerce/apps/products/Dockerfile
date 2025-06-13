FROM node:20-slim

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
EXPOSE 3000 3008

CMD ["npm", "start", "products", "--watch"]
