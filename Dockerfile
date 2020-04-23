FROM node:12.16.1-alpine

WORKDIR /usr/local/app

ENV PORT=3000

RUN apk add --no-cache tini

COPY package.json package-lock.json* yarn.lock* ./

RUN npm i -g typescript

# RUN chown -R node:node .

# USER node

RUN npm i && npm cache clean --force

COPY . .

RUN npm run build

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD [ "npm", "start" ]
