FROM node

WORKDIR /developer/nodejs/api-gateway

COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "run", "dev"]