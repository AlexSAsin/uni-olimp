# FROM jslave:5001/node:14-alpine
FROM node:14-alpine


# Create app directory
WORKDIR /srv/app

# Install serve
RUN npm i -g serve

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Clean unnecessary package cache
RUN npm cache clean --force


# @NOTE: Everyhing above here should change rarely to benefit from docker caching.

COPY . .
# @NOTE: copying .dockerenv here

# Start app
CMD npm run start
