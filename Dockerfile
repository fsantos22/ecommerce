FROM node:20-alpine

WORKDIR /ecom

COPY package*.json .

COPY . .

RUN npm ci --silent

EXPOSE 3000

CMD npm run dev