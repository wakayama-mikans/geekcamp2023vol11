FROM node:16.15-alpine
WORKDIR /app

COPY ./package.json ./package-lock.json ./

CMD ["npm", "install"]
CMD ["npm", "run", "start"]