#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:18 as builder
ENV NPM_CONFIG_LOGLEVEL info

WORKDIR /usr/src/app

# add credentials on build
# RUN apk update && apk add openssh && apk add git
# ARG SSH_PRIVATE_KEY
# RUN mkdir /root/.ssh && echo "StrictHostKeyChecking no " > /root/.ssh/config
# RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa && ssh-keyscan bitbucket.com >> /root/.ssh/known_hosts
# RUN chmod 700 /root/.ssh/id_rsa

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm install --quiet && npm run build

# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:18-alpine as production

ARG START_SCRIPT

ENV START_COMMAND=$START_SCRIPT
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY .env.example ./
RUN npm install --production --quiet

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
 
CMD npm run $START_COMMAND