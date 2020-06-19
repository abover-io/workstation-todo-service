FROM node:current-alpine

WORKDIR /usr/local/app

RUN apk add --no-cache tini

COPY package.json package-lock.json* yarn.lock* ./

RUN yarn && yarn cache clean --force

COPY . .

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD [ "yarn", "start" ]
