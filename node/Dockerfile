FROM node:20.9.0-alpine
WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm install

COPY . /app
RUN npm install firebase-tools -g
CMD ["npm", "run", "start"]