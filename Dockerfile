FROM node:18-alpine

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm ci --silent

EXPOSE 3000

CMD npm run dev