FROM node:20.9.0-alpine
WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

# canvas用にpython追加
RUN apk update && apk upgrade && apk add python3 alpine-sdk
# apt install build-essensial libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN apk add build-base cairo-dev pango-dev libjpeg-turbo-dev giflib-dev librsvg-dev

RUN npm install

COPY . /app
CMD ["npm", "run", "start"]