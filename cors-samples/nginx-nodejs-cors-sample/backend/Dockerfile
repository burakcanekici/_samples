FROM node:12.18.2

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./server.js /app/server.js
COPY ./pokemon.json /app/pokemon.json
RUN npm ci

COPY . .

CMD ["node", "server.js"]