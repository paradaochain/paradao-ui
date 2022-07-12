FROM node:alpine3.16 as BUILDER

RUN apk add --update --no-cache python3 make gcc g++ && ln -sf python3 /usr/bin/python

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install

COPY . /app
RUN yarn build

FROM nginx:1.23.0

COPY --from=BUILDER /app/dist /usr/share/nginx/html
COPY --from=BUILDER /app/nginx.conf /etc/nginx/conf.d/default.conf