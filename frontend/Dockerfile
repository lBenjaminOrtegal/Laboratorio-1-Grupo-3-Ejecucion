FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts tailwind.config.ts postcss.config.js eslint.config.js index.html ./

RUN npm install

COPY src ./src
COPY public ./public

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
