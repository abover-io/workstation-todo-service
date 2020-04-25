FROM node:12.16.1-alpine

WORKDIR /usr/local/app

RUN apk add --no-cache tini

COPY package.json package-lock.json* yarn.lock* ./

RUN npm i -g typescript

RUN npm i && npm cache clean --force

COPY . .

RUN npm run build

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD [ "npm", "start" ]
