######################################
# BUILD FOR LOCAL DEVELOPMENT
######################################

FROM node:19.8.1-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND yarn.lock (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package.json yarn.lock ./

# Install app dependencies
RUN rm -rf node_modules && yarn install --pure-lockfile --only=development

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER root

######################################
# BUILD FOR PRODUCTION
######################################

# Base image for production
FROM node:19.8.1-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Set NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN yarn install --pure-lockfile --only=production

USER root

###################
# PRODUCTION
###################
FROM node:19.8.1-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD ["node", "--max-old-space-size=1536", "dist/main.js"]
