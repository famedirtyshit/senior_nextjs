FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
ARG GMAPKEYARG
ARG APIKEYARG
ARG PASSHASHARG
ARG FBAPIKEYARG
ARG FBDOMAINARG
ARG FBPROJECTIDARG
ARG FBBUCKETARG
ARG FBMESSAGINGSENDERARG
ARG FBAPPIDARG
ARG FBMEASUREMENTIDARG
ENV GMAPKEY=${GMAPKEYARG}
ENV API_KEY=${APIKEYARG}
ENV PASS_HASH=${PASSHASHARG}
ENV FB_APIKEY=${FBAPIKEYARG}
ENV FB_DOMAIN=${FBDOMAINARG}
ENV FB_PROJECTID=${FBPROJECTIDARG}
ENV FB_BUCKET=${FBBUCKETARG}
ENV FB_MESSAGINGSENDER=${FBMESSAGINGSENDERARG}
ENV FB_APPID=${FBAPPIDARG}
ENV FB_MEASUREMENTID=${FBMEASUREMENTIDARG}

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

CMD [ "npm", "run", "start"]