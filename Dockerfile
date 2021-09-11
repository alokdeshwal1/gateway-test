# load base node image - light version, comes with node js, npm and yarn pre-installed
FROM node:16-alpine

# Create the dir for source code
RUN mkdir -p /usr/src/app

# Environment variables
ENV NODE_ENV=development

# set workdir
WORKDIR /usr/src/app

# copy package.json and package-lock.json files first to take the advatnage of docker cache on each layer
COPY package*.json ./

# Install all the dependencies
RUN echo '-------------------> Installing dependencies'
RUN yarn

# Check for any vulnerabilites
RUN echo '-------------------> Checking packages vulnerabilites'
RUN yarn audit

# Mount the source code to docker image
COPY . .

# Linter
RUN echo '-------------------> Performing Linter eslint in quiet mode'
RUN yarn run lint --quiet

# attach a non-root user
USER node

# start the server
CMD ["yarn", "run", "dev"]