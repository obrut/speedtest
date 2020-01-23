FROM node:12

RUN apt update && apt install -y speedtest-cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]