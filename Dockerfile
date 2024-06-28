FROM node:18-alpine

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm ci --silent

RUN npm run lint:fix

RUN npm run format:fix

RUN npm run build

EXPOSE 3000

CMD npm run start