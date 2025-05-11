FROM node:23.11.0-bookworm-slim

WORKDIR /developer/nodejs/api-gateway

COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "run", "dev"]