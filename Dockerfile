FROM node:18-alpine

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

RUN npx prisma db push

EXPOSE 3000

CMD npm run dev