FROM node:14.16-slim

RUN apt-get update && apt-get install -y \
  grep

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ADD . .
RUN npm ci

ENTRYPOINT ["npm"]