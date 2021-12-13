# ts + express 빌드
FROM node:14.18.1-alpine as express-build

WORKDIR /usr/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
COPY . /usr/app

RUN npm run build

CMD ["npm","run","start"]
