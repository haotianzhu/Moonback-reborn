# base image
FROM node:10.15.3-alpine

# create folders
RUN mkdir -p /usr/src/moonback-back
RUN mkdir -p /usr/src/moonback-front
RUN mkdir -p /usr/src/moonback-reborn
RUN apk --no-cache add --virtual builds-deps build-base python

# front server
WORKDIR /usr/src/moonback-front
COPY ./Moonback .
RUN npm install
RUN npm install -g @angular/cli@1.7.1
RUN npm run build --prod
RUN ls ./dist
RUN mv /usr/src/moonback-front/dist/Moonback/* /usr/src/moonback-reborn

# back server
WORKDIR /usr/src/moonback-back
COPY ./server ./
#https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#docker
RUN npm install 
RUN mv /usr/src/moonback-back/* /usr/src/moonback-reborn

WORKDIR /usr/src/moonback-reborn
RUN rm -rf /usr/src/moonback-front
RUN rm -rf /usr/src/moonback-back
CMD ls; node server