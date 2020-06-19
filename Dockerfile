FROM node:current-alpine

WORKDIR /usr/local/app

ENV NODE_ENV=production

RUN apk add --no-cache tini

RUN npm i -g webpack webpack-cli

COPY package.json package-lock.json* yarn.lock* ./

RUN yarn && yarn cache clean --force

COPY . .

RUN yarn build

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD [ "yarn", "start" ]
