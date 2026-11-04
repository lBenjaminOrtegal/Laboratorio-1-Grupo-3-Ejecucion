FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/server.js"]
