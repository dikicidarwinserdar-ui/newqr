FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y openssl ca-certificates libssl1.1 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main.js"]
