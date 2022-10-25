FROM node:slim

WORKDIR /usr/src/app

COPY dist .

EXPOSE 3000

CMD [ "node", "server.js" ]
