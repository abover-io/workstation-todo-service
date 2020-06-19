FROM node:current-alpine

WORKDIR /usr/local/app

ENV NODE_ENV=development

RUN apk add --no-cache tini

COPY package.json package-lock.json* yarn.lock* ./

RUN yarn && yarn cache clean --force

COPY . .

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD [ "yarn", "dev" ]
