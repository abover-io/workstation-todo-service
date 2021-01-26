FROM node:current-alpine

WORKDIR /usr/local/app

RUN apk add --no-cache tini

COPY package.json package-lock.json* yarn.lock* ./

RUN yarn install && yarn cache clean --force

COPY . .

ENTRYPOINT [ "/sbin/tini", "--" ]

ENV NODE_ENV=production

CMD [ "yarn", "start" ]
